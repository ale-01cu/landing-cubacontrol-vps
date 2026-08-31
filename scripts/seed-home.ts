// scripts/seed-home.ts
import PocketBase from 'pocketbase'
import { readFile, access } from 'node:fs/promises'
import { readFileSync } from 'node:fs'
import path from 'node:path'

type LocaleData = Record<string, any>
type Payload = Record<string, any>

interface SeedConfig {
  url: string
  email: string
  password: string
  authCollection: string
  publicDir: string
  locales: string[]
  reset: boolean
  dryRun: boolean
}

interface BannerSeed {
  headline: string
  title: string
  description: string
  background: string
  primary_btn_label?: string
  primary_btn_link?: string
  secondary_btn_label?: string
  secondary_btn_link?: string
}

interface HomePatronSeed {
  name: string
  logo: string
  website_url?: string
  sort_order: number
}

// New schema: 15 home collections + icons
const COLLECTIONS = [
  'icons',
  'home_banners',
  'home_essence',
  'home_services',
  'home_benefits',
  'home_supervision',
  'home_incidents',
  'home_laboratory',
  'home_laboratory_areas',
  'home_lab_certifications',
  'home_insurance',
  'home_insurance_types',
  'home_partners',
  'home_patrons',
  'home_patrons_section',
  'home_cta'
] as const

// For reset, delete dependents before icons (FK). Icons last.
const RESET_COLLECTIONS = [...COLLECTIONS].reverse() as unknown as string[]

function loadDotEnv(): void {
  try {
    const envPath = path.join(process.cwd(), '.env')
    const content = readFileSync(envPath, 'utf8')
    for (const line of content.split('\n')) {
      const trimmed = line.trim()
      if (!trimmed || trimmed.startsWith('#')) continue
      const eq = trimmed.indexOf('=')
      if (eq === -1) continue
      const key = trimmed.slice(0, eq).trim()
      let value = trimmed.slice(eq + 1).trim()
      if (
        (value.startsWith('"') && value.endsWith('"')) ||
        (value.startsWith("'") && value.endsWith("'"))
      ) {
        value = value.slice(1, -1)
      }
      if (!(key in process.env)) {
        process.env[key] = value
      }
    }
  } catch {
    // .env is optional
  }
}

loadDotEnv()

const config: SeedConfig = {
  url: process.env.PB_URL || 'http://127.0.0.1:8090',
  email: process.env.PB_EMAIL || '',
  password: process.env.PB_PASSWORD || '',
  authCollection: process.env.PB_AUTH_COLLECTION || '',
  publicDir: path.resolve(process.cwd(), process.env.PUBLIC_DIR || 'public'),
  locales: (process.env.LOCALES || 'es,en')
    .split(',')
    .map((x) => x.trim())
    .filter(Boolean),
  reset: process.env.RESET === 'true',
  dryRun: process.env.DRY_RUN === 'true'
}

const serviceIcons: string[] = [
  'i-lucide-shield',
  'i-lucide-package-search',
  'i-lucide-flask-conical',
  'i-lucide-ship',
  'i-lucide-clipboard-check',
  'i-lucide-brain-circuit'
]

const benefitIcons: string[] = [
  'i-lucide-shield-check',
  'i-lucide-clipboard-list',
  'i-lucide-package-search',
  'i-lucide-search-check'
]

const labAreaIcons: string[] = [
  'i-lucide-leaf',
  'i-lucide-apple',
  'i-lucide-milk',
  'i-lucide-wheat',
  'i-lucide-wine',
  'i-lucide-droplets',
  'i-lucide-box',
  'i-lucide-microscope'
]

const insuranceImages: string[] = [
  '/agent_images/seguro_de_vida.webp',
  '/agent_images/seguro_viajes.webp',
  '/agent_images/seguro_automotor.webp',
  '/agent_images/seguro_responsavilidad_civil.webp',
  '/agent_images/seguro_incendio.webp',
  '/agent_images/seguro_agricola.webp',
  '/agent_images/seguro_bienes_pecuarios.webp'
]

const patronRecords: HomePatronSeed[] = [
  { name: 'ONARC', logo: '/patrons/logo_onarc.png', website_url: '', sort_order: 1 },
  { name: 'ONN', logo: '/patrons/onn.jpg', website_url: '', sort_order: 2 },
  { name: 'Ministerio de Finanzas y Precios', logo: '/patrons/mfp.jpg', website_url: '', sort_order: 3 },
  { name: 'OSDE CAUDAL', logo: '/patrons/grupo-caudal.jpg', website_url: '', sort_order: 4 },
  { name: 'MITRANS', logo: '/patrons/mitrans.jpg', website_url: '', sort_order: 5 },
  { name: 'ESEN', logo: '/patrons/esen.jpg', website_url: '', sort_order: 6 },
  { name: 'ESICUBA', logo: '/patrons/esicuba.jpg', website_url: '', sort_order: 7 },
  { name: 'INTERMAR', logo: '/patrons/intermar.jpg', website_url: '', sort_order: 8 },
  { name: 'GECOME', logo: '/patrons/gecome.png', website_url: '', sort_order: 9 },
  { name: 'ADUANA', logo: '/patrons/aduana.webp', website_url: '', sort_order: 10 },
  { name: 'INTERAUDIT', logo: '/patrons/interauditlogo.webp', website_url: '', sort_order: 11 },
  { name: 'SUPERINTENDENCIA', logo: '/patrons/SUPERINTENDENCIA.webp', website_url: '', sort_order: 12 },
  { name: 'ONAT', logo: '/patrons/onatlogo.webp', website_url: '', sort_order: 13 },
  { name: 'CONAS', logo: '/patrons/conaslogo.webp', website_url: '', sort_order: 14 },
  { name: 'CANEC', logo: '/patrons/caneclogo.webp', website_url: '', sort_order: 15 },
  { name: 'CUBA ASISTUR', logo: '/patrons/asisturlogo.webp', website_url: '', sort_order: 16 }
]

// ponytail: icons cache avoids N+1 queries
let iconCache: Map<string, string> | null = null

function mimeByExtension(filePath: string): string {
  const ext = path.extname(filePath).toLowerCase()
  const map: Record<string, string> = {
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.png': 'image/png',
    '.webp': 'image/webp',
    '.svg': 'image/svg+xml'
  }
  return map[ext] || 'application/octet-stream'
}

function createUploadFile(bytes: Uint8Array, fileName: string, type: string): any {
  const FileConstructor = (globalThis as any).File
  if (typeof FileConstructor === 'function') {
    return new FileConstructor([bytes], fileName, { type })
  }
  const BlobConstructor = (globalThis as any).Blob
  if (typeof BlobConstructor !== 'function') {
    throw new Error('Blob is not available. Please use Node 18+ or install a Blob/File polyfill.')
  }
  const blob = new BlobConstructor([bytes], { type }) as any
  blob.name = fileName
  blob.lastModified = Date.now()
  return blob
}

async function readJson(filePath: string): Promise<LocaleData> {
  const raw = await readFile(filePath, 'utf8')
  return JSON.parse(raw) as LocaleData
}

async function loadLocaleData(): Promise<Record<string, LocaleData>> {
  const data: Record<string, LocaleData> = {}
  for (const locale of config.locales) {
    const filePath = path.join(process.cwd(), 'i18n', 'locales', `${locale}.json`)
    data[locale] = await readJson(filePath)
  }
  return data
}

function cleanPayload(payload: Payload): Payload {
  const result: Payload = {}
  for (const [key, value] of Object.entries(payload)) {
    if (value === undefined || value === null) continue
    if (typeof value === 'string' && value.trim() === '') continue
    result[key] = value
  }
  return result
}

async function toFile(relativePublicPath: string): Promise<any> {
  const cleanPath = relativePublicPath.startsWith('/') ? relativePublicPath.slice(1) : relativePublicPath
  const absolutePath = path.join(config.publicDir, cleanPath)
  try {
    await access(absolutePath)
  } catch {
    throw new Error(`Required file not found: ${absolutePath}\nMake sure the file exists inside your public folder.`)
  }
  const buffer = await readFile(absolutePath)
  const bytes = new Uint8Array(buffer)
  const fileName = path.basename(absolutePath)
  const type = mimeByExtension(absolutePath)
  return createUploadFile(bytes, fileName, type)
}

async function toFiles(paths: string[]): Promise<any[]> {
  return Promise.all(paths.map((p) => toFile(p)))
}

async function authenticate(): Promise<PocketBase> {
  const pb = new PocketBase(config.url)
  if (!config.email || !config.password) {
    throw new Error('Missing credentials. Set PB_EMAIL and PB_PASSWORD environment variables.')
  }
  if (config.authCollection) {
    await pb.collection(config.authCollection).authWithPassword(config.email, config.password)
    return pb
  }
  try {
    await pb.collection('_superusers').authWithPassword(config.email, config.password)
    return pb
  } catch {
    try {
      await pb.collection('users').authWithPassword(config.email, config.password)
      return pb
    } catch {
      throw new Error(`Could not authenticate against PocketBase at ${config.url}.\nCheck PB_URL, PB_EMAIL, PB_PASSWORD and PB_AUTH_COLLECTION if needed.`)
    }
  }
}

async function resetCollections(pb: PocketBase): Promise<void> {
  console.log('\n--- RESET: deleting existing records ---')
  for (const collection of RESET_COLLECTIONS) {
    try {
      const records = await pb.collection(collection).getFullList({ batch: 500 })
      if (config.dryRun) {
        console.log(`[DRY-RUN] Would delete ${records.length} records from ${collection}`)
        continue
      }
      for (const record of records) {
        await pb.collection(collection).delete(record.id)
      }
      console.log(`Deleted ${records.length} records from ${collection}`)
    } catch (e: any) {
      console.warn(`Skipped reset for ${collection}: ${e?.message || e}`)
    }
  }
}

async function createRecord(pb: PocketBase, collection: string, payload: Payload, label: string): Promise<any> {
  if (config.dryRun) {
    console.log(`[DRY-RUN] Would create ${collection}: ${label}`)
    return { id: 'dry-run' }
  }
  try {
    const record = await pb.collection(collection).create(payload)
    console.log(`Created ${collection}: ${label}`)
    return record
  } catch (error: any) {
    console.error(`Error creating ${collection}: ${label}`)
    console.error(error?.response?.data || error?.message || error)
    const isUnique = error?.response?.data?.data?.locale?.code === 'validation_not_unique'
      || String(error?.response?.data?.data?.locale?.message || '').includes('must be unique')
    if (isUnique) {
      console.error(`\nHint: ${collection} has UNIQUE(locale). Record for this locale already exists.`)
      console.error(`Run with RESET=true to delete existing records first: RESET=true npx tsx scripts/seed-home.ts\n`)
    }
    throw error
  }
}

// Icons must exist before any relation fields
async function ensureIcons(pb: PocketBase): Promise<Map<string, string>> {
  if (iconCache) return iconCache
  console.log('\n--- Seeding icons ---')
  const allNames = [...new Set([...serviceIcons, ...benefitIcons, ...labAreaIcons, 'i-lucide-award'])]
  const map = new Map<string, string>()

  if (config.dryRun) {
    console.log(`[DRY-RUN] Would ensure ${allNames.length} icons`)
    for (const n of allNames) map.set(n, 'dry-run')
    iconCache = map
    return map
  }

  let existing: any[] = []
  try {
    existing = await pb.collection('icons').getFullList({ batch: 500 })
  } catch (e: any) {
    console.warn(`Could not list icons: ${e?.message}`)
  }
  for (const r of existing) map.set(r.name, r.id)

  for (const name of allNames) {
    if (map.has(name)) continue
    try {
      const rec = await pb.collection('icons').create({ name })
      console.log(`Created icons: ${name}`)
      map.set(name, rec.id)
    } catch (e: any) {
      // unique violation -> fetch again
      const data = e?.response?.data
      if (data?.data?.name || String(e?.message).includes('unique')) {
        try {
          const found = await pb.collection('icons').getFirstListItem(`name="${name}"`)
          map.set(name, found.id)
          console.log(`Found existing icon: ${name}`)
        } catch {
          console.error(`Error ensuring icon ${name}`, e?.response?.data || e)
          throw e
        }
      } else {
        throw e
      }
    }
  }
  iconCache = map
  return map
}

function buildBanners(locale: string, localeData: LocaleData): BannerSeed[] {
  if (locale === 'es') {
    return [
      {
        headline: 'Servicios Internacionales de Supervisión',
        title: 'CubaControl S.A',
        description: 'Sociedad Mercantil de capital 100% cubano con 8 Unidades Empresariales de Base, organizadas mediante Oficinas de Venta y Grupos de Trabajo.',
        background: '/pared.jpg',
        primary_btn_label: 'Solicitar',
        primary_btn_link: '/contact',
        secondary_btn_label: 'Servicios',
        secondary_btn_link: '/services'
      },
      {
        headline: 'Servicios de Laboratorio',
        title: 'Laboratorio de Supervisión',
        description: 'El Laboratorio de Supervisión de la Calidad CUBACONTROL S.A. es una unidad independiente que garantiza la calidad en operaciones comerciales de importación y exportación.',
        background: '/lab_images/lab-banner.webp',
        primary_btn_label: 'Ver más',
        primary_btn_link: '#laboratorio',
        secondary_btn_label: 'Servicios',
        secondary_btn_link: '/services'
      },
      {
        headline: 'Agente de Seguros',
        title: 'SIS CUBACONTROL S.A',
        description: 'Entidad autorizada por la Superintendencia de Seguros. Vendemos seguros de vida, viaje, automotor, responsabilidad civil, incendio, bienes agrícolas y pecuarios.',
        background: '/agent_images/seguros_banner.webp',
        primary_btn_label: 'Ver más',
        primary_btn_link: '#seguros',
        secondary_btn_label: 'Servicios',
        secondary_btn_link: '/services'
      }
    ]
  }
  const hero = localeData?.landing?.hero ?? {}
  const laboratorio = localeData?.landing?.laboratorio ?? {}
  const seguros = localeData?.landing?.seguros ?? {}
  const requestLabel = hero?.links?.request || 'Request'
  const servicesLabel = hero?.links?.services || 'Services'
  const viewMoreLabel = locale === 'en' ? 'View more' : 'Ver más'
  return [
    {
      headline: hero?.headline || 'International Supervision Services',
      title: hero?.title || 'CubaControl S.A.',
      description: hero?.description || 'A commercial company with 100% Cuban capital and 8 Business Units organized through Sales Offices and Work Groups.',
      background: '/pared.jpg',
      primary_btn_label: requestLabel,
      primary_btn_link: '/contact',
      secondary_btn_label: servicesLabel,
      secondary_btn_link: '/services'
    },
    {
      headline: 'Laboratory Services',
      title: laboratorio?.title || 'Quality Supervision Laboratory',
      description: laboratorio?.description || 'The CUBACONTROL S.A. Quality Supervision Laboratory is an independent unit that guarantees quality in import and export commercial operations.',
      background: '/lab_images/lab-banner.webp',
      primary_btn_label: viewMoreLabel,
      primary_btn_link: '#laboratorio',
      secondary_btn_label: servicesLabel,
      secondary_btn_link: '/services'
    },
    {
      headline: seguros?.headline || 'Insurance Agent',
      title: seguros?.title || 'SIS CUBACONTROL S.A',
      description: seguros?.intro || 'Entity authorized by the Insurance Superintendency to sell personal and business insurance policies.',
      background: '/agent_images/seguros_banner.webp',
      primary_btn_label: viewMoreLabel,
      primary_btn_link: '#seguros',
      secondary_btn_label: servicesLabel,
      secondary_btn_link: '/services'
    }
  ]
}

// ── seeders ──────────────────────────────────────────────────────────

async function seedBanners(pb: PocketBase, locale: string, localeData: LocaleData): Promise<void> {
  console.log(`\n--- Seeding home_banners for ${locale} ---`)
  const banners = buildBanners(locale, localeData)
  for (let index = 0; index < banners.length; index++) {
    const banner = banners[index]
    const background = await toFile(banner.background)
    const payload = cleanPayload({
      locale,
      headline: banner.headline,
      title: banner.title,
      description: banner.description,
      background,
      primary_btn_label: banner.primary_btn_label,
      primary_btn_link: banner.primary_btn_link,
      secondary_btn_label: banner.secondary_btn_label,
      secondary_btn_link: banner.secondary_btn_link,
      sort_order: index + 1,
      active: true
    })
    await createRecord(pb, 'home_banners', payload, `${locale} banner ${index + 1} - ${banner.title}`)
  }
}

async function seedEssence(pb: PocketBase, locale: string, localeData: LocaleData): Promise<void> {
  console.log(`\n--- Seeding home_essence for ${locale} ---`)
  const essence = localeData?.landing?.essence ?? {}
  const payload = cleanPayload({
    locale,
    title: essence?.title,
    description: essence?.description,
    mission_title: essence?.mission?.title,
    mission_content: essence?.mission?.content,
    vision_title: essence?.vision?.title,
    vision_content: essence?.vision?.content,
    active: true
  })
  await createRecord(pb, 'home_essence', payload, `${locale} essence`)
}

async function seedServices(pb: PocketBase, locale: string, localeData: LocaleData): Promise<void> {
  console.log(`\n--- Seeding home_services for ${locale} ---`)
  const landing = localeData?.landing ?? {}
  const icons = await ensureIcons(pb)
  const items = landing?.services?.items ?? []
  // image distinct per locale section: use generic or lab banner as fallback
  const image = await toFile('/pared.jpg')
  const payload: Payload = cleanPayload({
    locale,
    section_title: landing?.services?.title,
    section_description: landing?.services?.description,
    image,
    button_label: landing?.services?.link?.label || (locale === 'es' ? 'Solicitar Servicio' : 'Request Service'),
    button_link: '/contact',
    active: true
  })
  // service_1..6
  for (let i = 0; i < 6; i++) {
    const item = items[i]
    const n = i + 1
    payload[`service_${n}_title`] = item?.title || `Service ${n}`
    payload[`service_${n}_description`] = item?.description || ''
    const iconName = serviceIcons[i] || 'i-lucide-circle'
    payload[`service_${n}_icon`] = icons.get(iconName) || iconName
  }
  await createRecord(pb, 'home_services', cleanPayload(payload), `${locale} services`)
}

async function seedBenefits(pb: PocketBase, locale: string, localeData: LocaleData): Promise<void> {
  console.log(`\n--- Seeding home_benefits for ${locale} ---`)
  const landing = localeData?.landing ?? {}
  const icons = await ensureIcons(pb)
  const items = landing?.benefits?.items ?? []
  const payload: Payload = cleanPayload({
    locale,
    section_title: landing?.benefits?.title,
    active: true
  })
  for (let i = 0; i < 4; i++) {
    const item = items[i]
    const n = i + 1
    payload[`benefit_${n}_title`] = item?.title || `Benefit ${n}`
    payload[`benefit_${n}_description`] = item?.description || ''
    const iconName = benefitIcons[i] || 'i-lucide-circle'
    const iconId = icons.get(iconName) || iconName
    // schema quirk: benefit_4_icon is text not relation, but sending id string works for both
    payload[`benefit_${n}_icon`] = iconId
  }
  await createRecord(pb, 'home_benefits', payload, `${locale} benefits`)
}

async function seedSupervision(pb: PocketBase, locale: string, localeData: LocaleData): Promise<void> {
  console.log(`\n--- Seeding home_supervision for ${locale} ---`)
  const sup = localeData?.landing?.supervision ?? {}
  const payload = cleanPayload({
    locale,
    section_title: sup?.title,
    description: sup?.description,
    description_2: sup?.description1,
    note: sup?.note,
    objective_title: sup?.objective?.title,
    objective_description: sup?.objective?.description,
    active: true
  })
  await createRecord(pb, 'home_supervision', payload, `${locale} supervision`)
}

async function seedIncidents(pb: PocketBase, locale: string, localeData: LocaleData): Promise<void> {
  console.log(`\n--- Seeding home_incidents for ${locale} ---`)
  const incidents = (localeData as any)?.incidents ?? {}
  const partnerTitle = localeData?.landing?.partners ?? {}
  // section_title/description come from top-level incidents; fallback to partners if needed
  const section_title = incidents?.title || 'Incidencias'
  const section_description = incidents?.description || ''
  const images = await toFiles(Array.from({ length: 24 }, (_, i) => `/incidencias/${i + 1}.jpg`))
  const payload = cleanPayload({
    locale,
    section_title,
    section_description,
    images,
    active: true
  })
  // silence unused var warning
  void partnerTitle
  await createRecord(pb, 'home_incidents', payload, `${locale} incidents (24 images)`)
}

async function seedLaboratory(pb: PocketBase, locale: string, localeData: LocaleData): Promise<void> {
  console.log(`\n--- Seeding home_laboratory for ${locale} ---`)
  const lab = localeData?.landing?.laboratorio ?? {}
  const payload = cleanPayload({
    locale,
    section_headline: lab?.headline,
    section_title: lab?.title,
    section_description: lab?.description,
    button_label: lab?.button,
    button_link: '/contact',
    active: true
  })
  try {
    await createRecord(pb, 'home_laboratory', payload, `${locale} laboratory`)
  } catch (e: any) {
    const localeErr = e?.response?.data?.data?.locale
    const isLocaleError = localeErr?.code === 'validation_invalid_value' || String(localeErr?.message || '').includes('Invalid value') || (e?.status === 400 && !!localeErr)
    if (isLocaleError) {
      console.warn(`Skipped home_laboratory for ${locale}: locale not allowed by schema (${JSON.stringify(e?.response?.data)}). Only 'es' is permitted.`)
      return
    }
    throw e
  }
}

async function seedLaboratoryAreas(pb: PocketBase, locale: string, localeData: LocaleData): Promise<void> {
  console.log(`\n--- Seeding home_laboratory_areas for ${locale} ---`)
  const icons = await ensureIcons(pb)
  const areas = localeData?.landing?.laboratorio?.areas ?? []
  for (let i = 0; i < areas.length; i++) {
    const area = areas[i]
    const name = typeof area === 'string' ? area : area?.title
    if (!name) continue
    const iconName = labAreaIcons[i] || 'i-lucide-flask-conical'
    const payload = cleanPayload({
      locale,
      name,
      icon: icons.get(iconName) || iconName,
      active: true
    })
    await createRecord(pb, 'home_laboratory_areas', payload, `${locale} lab area - ${name}`)
  }
}

async function seedLabCertifications(pb: PocketBase, locale: string, localeData: LocaleData): Promise<void> {
  console.log(`\n--- Seeding home_lab_certifications for ${locale} ---`)
  const lab = localeData?.landing?.laboratorio ?? {}
  const certs: string[] = lab?.certifications ?? []
  const image = await toFile('/lab_images/lab-banner.webp')
  const payload = cleanPayload({
    locale,
    section_headline: lab?.certHeadline,
    section_title: lab?.certTitle,
    section_description: lab?.certDescription,
    image,
    certification_1: certs[0],
    certification_2: certs[1],
    certification_3: certs[2],
    certification_4: certs[3],
    certification_5: certs[4],
    active: true
  })
  await createRecord(pb, 'home_lab_certifications', payload, `${locale} lab certifications`)
}

async function seedInsurance(pb: PocketBase, locale: string, localeData: LocaleData): Promise<void> {
  console.log(`\n--- Seeding home_insurance for ${locale} ---`)
  const seguros = localeData?.landing?.seguros ?? {}
  const payload = cleanPayload({
    locale,
    section_headline: seguros?.headline,
    section_title: seguros?.title,
    section_description: seguros?.intro,
    types_title: seguros?.typesTitle,
    button_label: seguros?.button,
    button_link: '/contact',
    active: true
  })
  await createRecord(pb, 'home_insurance', payload, `${locale} insurance header`)
}

async function seedInsuranceTypes(pb: PocketBase, locale: string, localeData: LocaleData): Promise<void> {
  console.log(`\n--- Seeding home_insurance_types for ${locale} ---`)
  const types = localeData?.landing?.seguros?.types ?? []
  for (let i = 0; i < types.length; i++) {
    const item = types[i]
    if (!item?.title || !item?.description) throw new Error(`Invalid insurance type at index ${i}`)
    const imagePath = insuranceImages[i]
    if (!imagePath) throw new Error(`Missing insurance image for index ${i}: ${item.title}`)
    const image = await toFile(imagePath)
    const payload = cleanPayload({
      locale,
      name: item.title,
      description: item.description,
      image
    })
    await createRecord(pb, 'home_insurance_types', payload, `${locale} insurance type - ${item.title}`)
  }
}

async function seedPartners(pb: PocketBase, locale: string, localeData: LocaleData): Promise<void> {
  console.log(`\n--- Seeding home_partners for ${locale} ---`)
  const partners = localeData?.landing?.partners ?? {}
  const images = await toFiles(['/partners/partners.webp', '/partners/ops.webp'])
  const payload = cleanPayload({
    locale,
    section_title: partners?.title,
    section_description: partners?.description,
    images,
    active: true
  })
  await createRecord(pb, 'home_partners', payload, `${locale} partners`)
}

async function seedPatronsSection(pb: PocketBase, locale: string, localeData: LocaleData): Promise<void> {
  console.log(`\n--- Seeding home_patrons_section for ${locale} ---`)
  // No dedicated i18n key for patrons header; reuse trust as fallback
  const trust = localeData?.landing?.trust ?? {}
  const payload = cleanPayload({
    locale,
    section_title: trust?.title || (locale === 'es' ? 'Nuestros Patrocinadores' : 'Our Patrons'),
    section_description: trust?.description || '',
    active: true
  })
  await createRecord(pb, 'home_patrons_section', payload, `${locale} patrons section`)
}

async function seedPatrons(pb: PocketBase, locale: string): Promise<void> {
  console.log(`\n--- Seeding home_patrons for ${locale} ---`)
  for (const patron of patronRecords) {
    const logo = await toFile(patron.logo)
    const payload = cleanPayload({
      locale,
      name: patron.name,
      logo,
      website_url: patron.website_url,
      sort_order: patron.sort_order,
      active: true
    })
    await createRecord(pb, 'home_patrons', payload, `${locale} patron - ${patron.name}`)
  }
}

async function seedCta(pb: PocketBase, locale: string, localeData: LocaleData): Promise<void> {
  console.log(`\n--- Seeding home_cta for ${locale} ---`)
  const sub = localeData?.landing?.subscription ?? {}
  // placeholder may contain {'@'} templating; keep as-is or normalize
  const rawPlaceholder: string = sub?.input?.placeholder || ''
  const placeholder = rawPlaceholder.split("{'@'}").join('@').split("{'}").join('')
  const payload = cleanPayload({
    locale,
    section_title: sub?.title,
    section_description: sub?.description,
    placeholder: placeholder || 'email@company.com',
    button_label: sub?.actions?.submit?.label,
    note: sub?.note,
    active: true
  })
  await createRecord(pb, 'home_cta', payload, `${locale} cta`)
}

async function main(): Promise<void> {
  console.log('Home PocketBase seed script - TypeScript')
  console.log('----------------------------------------')
  console.log('PocketBase URL:', config.url)
  console.log('Public directory:', config.publicDir)
  console.log('Locales:', config.locales.join(', '))
  console.log('Reset existing data:', config.reset)
  console.log('Dry run:', config.dryRun)

  const pb = await authenticate()
  console.log('Authenticated as:', (pb.authStore as any)?.record?.email || (pb.authStore as any)?.record?.id || 'unknown')

  if (config.reset) {
    await resetCollections(pb)
  }

  const localeData = await loadLocaleData()

  await ensureIcons(pb)

  for (const locale of config.locales) {
    console.log('\n==============================')
    console.log(`Seeding locale: ${locale}`)
    console.log('==============================')
    await seedBanners(pb, locale, localeData[locale])
    await seedEssence(pb, locale, localeData[locale])
    await seedServices(pb, locale, localeData[locale])
    await seedBenefits(pb, locale, localeData[locale])
    await seedSupervision(pb, locale, localeData[locale])
    await seedIncidents(pb, locale, localeData[locale])
    await seedLaboratory(pb, locale, localeData[locale])
    await seedLaboratoryAreas(pb, locale, localeData[locale])
    await seedLabCertifications(pb, locale, localeData[locale])
    await seedInsurance(pb, locale, localeData[locale])
    await seedInsuranceTypes(pb, locale, localeData[locale])
    await seedPartners(pb, locale, localeData[locale])
    await seedPatronsSection(pb, locale, localeData[locale])
    await seedPatrons(pb, locale)
    await seedCta(pb, locale, localeData[locale])
  }

  console.log('\nSeed process completed successfully.')
}

main().catch((error: unknown) => {
  console.error('\nSeed script failed.')
  console.error(error)
  process.exit(1)
})
