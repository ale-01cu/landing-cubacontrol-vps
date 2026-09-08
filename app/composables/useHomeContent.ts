import type { IBanner } from '~/components/banners/HeroBannerCarousel.vue'

export interface HomeBannerRecord {
  id: string
  collectionId: string
  locale: string
  headline: string
  title: string
  description: string
  background: string
  primary_btn_label: string
  primary_btn_link: string
  secondary_btn_label: string
  secondary_btn_link: string
  sort_order: number
  active: boolean
}

export interface HomeEssenceRecord {
  id: string
  collectionId: string
  locale: string
  title: string
  description: string
  mission_title: string
  mission_content: string
  vision_title: string
  vision_content: string
  active: boolean
}

export interface HomeServicesRecord {
  id: string
  collectionId: string
  locale: string
  section_title: string
  section_description: string
  image: string
  button_label: string
  button_link: string
  service_1_title: string
  service_1_description: string
  service_1_icon: string
  service_2_title: string
  service_2_description: string
  service_2_icon: string
  service_3_title: string
  service_3_description: string
  service_3_icon: string
  service_4_title: string
  service_4_description: string
  service_4_icon: string
  service_5_title: string
  service_5_description: string
  service_5_icon: string
  service_6_title: string
  service_6_description: string
  service_6_icon: string
  active: boolean
  expand?: Record<string, { name: string } | undefined>
}

export interface HomeBenefitsRecord {
  id: string
  collectionId: string
  locale: string
  section_title: string
  active: boolean
  benefit_1_title: string
  benefit_1_description: string
  benefit_1_icon: string
  benefit_2_title: string
  benefit_2_description: string
  benefit_2_icon: string
  benefit_3_title: string
  benefit_3_description: string
  benefit_3_icon: string
  benefit_4_title: string
  benefit_4_description: string
  benefit_4_icon: string // schema is text but seed stores id; handle both
  expand?: Record<string, { name: string } | undefined>
}

export interface HomeSupervisionRecord {
  id: string
  collectionId: string
  locale: string
  section_title: string
  description: string
  description_2: string
  note: string
  objective_title: string
  objective_description: string
  active: boolean
}

export interface HomeIncidentsRecord {
  id: string
  collectionId: string
  locale: string
  section_title: string
  section_description: string
  images: string[]
  active: boolean
}

export interface HomeLaboratoryRecord {
  id: string
  collectionId: string
  locale: string
  section_headline: string
  section_title: string
  section_description: string
  button_label: string
  button_link: string
  active: boolean
}

export interface HomeLaboratoryAreaRecord {
  id: string
  collectionId: string
  locale: string
  name: string
  icon: string
  active: boolean
  expand?: { icon?: { name: string } }
}

export interface HomeLabCertRecord {
  id: string
  collectionId: string
  locale: string
  section_headline: string
  section_title: string
  section_description: string
  image: string
  certification_1: string
  certification_2: string
  certification_3: string
  certification_4: string
  certification_5: string
  active: boolean
}

export interface HomeInsuranceHeaderRecord {
  id: string
  collectionId: string
  locale: string
  section_headline: string
  section_title: string
  section_description: string
  types_title: string
  button_label: string
  button_link: string
  active: boolean
}

export interface HomeInsuranceTypeRecord {
  id: string
  collectionId: string
  locale: string
  name: string
  description: string
  image: string
}

export interface HomePartnersRecord {
  id: string
  collectionId: string
  locale: string
  section_title: string
  section_description: string
  images: string[]
  active: boolean
}

export interface HomePatronsSectionRecord {
  id: string
  collectionId: string
  locale: string
  section_title: string
  section_description: string
  active: boolean
}

export interface HomePatronRecord {
  id: string
  collectionId: string
  locale: string
  name: string
  logo: string
  website_url: string
  sort_order: number
  active: boolean
}

export interface HomeCtaRecord {
  id: string
  collectionId: string
  locale: string
  section_title: string
  section_description: string
  placeholder: string
  button_label: string
  note: string
  active: boolean
}

// Legacy exports for compat
export type HomeTextRecord = HomeEssenceRecord
export type HomeItemRecord = HomeLaboratoryAreaRecord
export type HomeInsuranceRecord = HomeInsuranceTypeRecord
export type HomePartnerRecord = HomePartnersRecord
export type HomeSupervisionLegacy = HomeSupervisionRecord
export type HomeIncidentRecord = HomeIncidentsRecord

function resolveIcon(record: any, field: string): string {
  const expanded = record?.expand?.[field]
  if (expanded?.name) return expanded.name
  const v = record?.[field]
  // PB relation stores id (e.g. pbc_xxx), not icon name. Only return if it looks like an icon class.
  if (typeof v === 'string' && v.startsWith('i-')) return v
  // benefit_4_icon is text storing id string — treat as missing so fallback applies
  if (typeof v === 'string' && v && !/^[a-z0-9]{15}$/.test(v)) return v
  return ''
}

export const useHomeContent = () => {
  const { $pb } = useNuxtApp()
  const { locale } = useI18n()

  const banners = useState<IBanner[]>('home-banners', () => [])
  const essence = useState<HomeEssenceRecord | null>('home-essence', () => null)
  const services = useState<HomeServicesRecord | null>('home-services', () => null)
  const benefits = useState<HomeBenefitsRecord | null>('home-benefits', () => null)
  const supervision = useState<HomeSupervisionRecord | null>('home-supervision', () => null)
  const incidents = useState<HomeIncidentsRecord | null>('home-incidents', () => null)
  const laboratory = useState<HomeLaboratoryRecord | null>('home-laboratory', () => null)
  const labAreas = useState<HomeLaboratoryAreaRecord[]>('home-lab-areas', () => [])
  const labCerts = useState<HomeLabCertRecord | null>('home-lab-certs', () => null)
  const insuranceHeader = useState<HomeInsuranceHeaderRecord | null>('home-insurance-header', () => null)
  const insuranceTypes = useState<HomeInsuranceTypeRecord[]>('home-insurance-types', () => [])
  const partners = useState<HomePartnersRecord | null>('home-partners', () => null)
  const patronsSection = useState<HomePatronsSectionRecord | null>('home-patrons-section', () => null)
  const patronRecords = useState<HomePatronRecord[]>('home-patrons', () => [])
  const cta = useState<HomeCtaRecord | null>('home-cta', () => null)

  // legacy states kept for compat (empty but reactive)
  const textsMap = useState<Map<string, string>>('home-texts', () => new Map())
  const itemsByCategory = useState<Record<string, any[]>>('home-items', () => ({}))
  const itemsBySection = itemsByCategory
  const supervisionRecords = useState<HomeSupervisionRecord[]>('home-supervision-records', () => [])
  const incidentRecords = useState<HomeIncidentsRecord[]>('home-incidents-records', () => [])
  const partnerRecords = useState<HomePartnersRecord[]>('home-partners-records', () => [])
  const insuranceRecords = computed(() => insuranceTypes.value)

  const pending = useState<boolean>('home-pending', () => false)
  const error = useState<string | null>('home-error', () => null)
  // ponytail: distingue "aún no cargó" (mostrar fallback) de "cargó sin activos" (ocultar)
  const fetched = useState<boolean>('home-fetched', () => false)
  // ponytail: true si PB falló por red (mostrar fallback); 404 = sin activos (ocultar)
  const fetchFailed = useState<boolean>('home-fetch-failed', () => false)

  const isNotFound = (e: any) => e?.status === 404 || e?.data?.code === 404

  const getFileUrl = (record: { id: string, collectionId: string }, filename: string) => {
    if (!filename) return ''
    try {
      return ($pb as any).files.getURL(record, filename)
    } catch {
      return ''
    }
  }

  const resolveIconName = (record: any, field: string, fallback: string) => {
    const v = resolveIcon(record, field)
    return v || fallback
  }

  // Deprecated but kept for fallback — now reads from new records
  const getText = (key: string, fallback: string) => {
    // map new records to old PB_TEXT_TO_FRONTEND keys
    const map: Record<string, string | undefined> = {
      'essence.title': essence.value?.title,
      'essence.description': essence.value?.description,
      'essence.mission.title': essence.value?.mission_title,
      'essence.mission.content': essence.value?.mission_content,
      'essence.vision.title': essence.value?.vision_title,
      'essence.vision.content': essence.value?.vision_content,
      'services.title': services.value?.section_title,
      'services.description': services.value?.section_description,
      'benefits.title': benefits.value?.section_title,
      'seguros.headline': insuranceHeader.value?.section_headline,
      'seguros.title': insuranceHeader.value?.section_title,
      'seguros.intro': insuranceHeader.value?.section_description,
      'seguros.button': insuranceHeader.value?.button_label,
      'seguros.typesTitle': insuranceHeader.value?.types_title,
      'laboratorio.headline': laboratory.value?.section_headline,
      'laboratorio.title': laboratory.value?.section_title,
      'laboratorio.description': laboratory.value?.section_description,
      'laboratorio.button': laboratory.value?.button_label,
      'laboratorio.areasTitle': undefined, // areasTitle not in new header, fallback to i18n
      'laboratorio.certHeadline': labCerts.value?.section_headline,
      'laboratorio.certTitle': labCerts.value?.section_title,
      'laboratorio.certDescription': labCerts.value?.section_description,
      'supervision.title': supervision.value?.section_title,
      'supervision.description': supervision.value?.description,
      'supervision.description1': supervision.value?.description_2,
      'supervision.note': supervision.value?.note,
      'supervision.objective.title': supervision.value?.objective_title,
      'supervision.objective.description': supervision.value?.objective_description,
      'incidents.title': incidents.value?.section_title,
      'incidents.description': incidents.value?.section_description,
      'cta.title': cta.value?.section_title,
      'cta.description': cta.value?.section_description,
      'cta.placeholder': cta.value?.placeholder,
      'cta.button_label': cta.value?.button_label,
      'cta.note': cta.value?.note,
      'trust.title': patronsSection.value?.section_title,
      'trust.description': patronsSection.value?.section_description,
      'partners.title': partners.value?.section_title,
      'partners.description': partners.value?.section_description,
    }
    const v = map[key]
    if (v !== undefined && v !== '') return v
    // also check legacy textsMap for any still seeded
    const legacy = textsMap.value.get(key)
    if (legacy) return legacy
    return fallback
  }

  const getSectionItems = <T>(section: string, fallback: T[]): T[] => {
    if (section === 'services' && services.value) {
      const arr: any[] = []
      for (let i = 1; i <= 6; i++) {
        const title = (services.value as any)[`service_${i}_title`]
        if (!title) continue
        arr.push({
          title,
          description: (services.value as any)[`service_${i}_description`],
          icon: resolveIcon(services.value, `service_${i}_icon`) || `i-lucide-circle`
        })
      }
      if (arr.length) return arr as unknown as T[]
    }
    if (section === 'benefits' && benefits.value) {
      const arr: any[] = []
      for (let i = 1; i <= 4; i++) {
        const title = (benefits.value as any)[`benefit_${i}_title`]
        if (!title) continue
        arr.push({
          title,
          description: (benefits.value as any)[`benefit_${i}_description`],
          icon: resolveIcon(benefits.value, `benefit_${i}_icon`) || `i-lucide-circle`
        })
      }
      if (arr.length) return arr as unknown as T[]
    }
    if ((section === 'lab_areas' || section === 'labAreas') && labAreas.value.length) {
      const arr = labAreas.value.map(r => ({
        title: r.name,
        icon: resolveIcon(r, 'icon') || '',
        raw: r
      }))
      return arr as unknown as T[]
    }
    if ((section === 'lab_certifications' || section === 'certifications') && labCerts.value) {
      const certs = [labCerts.value.certification_1, labCerts.value.certification_2, labCerts.value.certification_3, labCerts.value.certification_4, labCerts.value.certification_5].filter(Boolean)
      const arr = certs.map(c => ({ title: c, icon: 'i-lucide-award' }))
      if (arr.length) return arr as unknown as T[]
    }
    const alias: Record<string, string> = { certifications: 'lab_certifications' }
    const cat = alias[section] || section
    const items = itemsByCategory.value[cat]
    if (items && items.length) return items as unknown as T[]
    const direct = itemsByCategory.value[section]
    if (direct && direct.length) return direct as unknown as T[]
    return fallback
  }

  const getInsuranceImageUrl = (record: HomeInsuranceTypeRecord) => {
    if (!record.image) return ''
    return getFileUrl(record as any, record.image)
  }

  const getPartnerLogoUrl = (_record: any) => ''
  const getPatronLogoUrl = (record: HomePatronRecord) => {
    if (!record.logo) return ''
    return getFileUrl(record as any, record.logo)
  }

  const getSupervisionImageUrl = (_record: any) => ''
  const supervisionImageUrl = computed(() => '')

  const getIncidentImageUrl = (_record: any) => ''

  const getPartnersImageUrls = computed(() => {
    if (!partners.value?.images?.length) return [] as string[]
    return partners.value.images.map(f => getFileUrl(partners.value as any, f))
  })

  const getIncidentsImageUrls = computed(() => {
    if (!incidents.value?.images?.length) return [] as string[]
    return incidents.value.images.map(f => getFileUrl(incidents.value as any, f))
  })

  const mapBanner = (r: HomeBannerRecord): IBanner => {
    const bg = r.background ? getFileUrl(r as any, r.background) : ''
    const links: any[] = []
    if (r.primary_btn_label) {
      links.push({
        label: r.primary_btn_label,
        to: r.primary_btn_link || '/contact',
        trailingIcon: 'i-lucide-arrow-right',
        size: 'xl',
        class: 'rounded-3xl'
      })
    }
    if (r.secondary_btn_label) {
      links.push({
        label: r.secondary_btn_label,
        to: r.secondary_btn_link || '/services',
        icon: 'i-lucide-list',
        size: 'xl',
        color: 'neutral',
        variant: 'subtle',
        class: 'rounded-3xl'
      })
    }
    return {
      headline: r.headline || null,
      title: r.title || null,
      description: r.description || null,
      background: bg || null,
      gradientColor: 'from-black/100 via-black/70 to-black/10 sm:from-black/85 sm:via-black/40 sm:to-black/0',
      orientation: 'horizontal',
      headlineColor: 'text-white',
      titleColor: 'text-white',
      descriptionColor: 'text-neutral-300',
      links: links.length ? links : null
    }
  }

  const fetchHomeContent = async (targetLocale?: string) => {
    const loc = targetLocale || locale.value
    pending.value = true
    error.value = null
    fetchFailed.value = false
    try {
      const [
        bannersRes,
        essenceRes,
        servicesRes,
        benefitsRes,
        supervisionRes,
        incidentsRes,
        labRes,
        labAreasRes,
        labCertsRes,
        insuranceHeaderRes,
        insuranceTypesRes,
        partnersRes,
        patronsSectionRes,
        patronsRes,
        ctaRes
      ] = await Promise.allSettled([
        ($pb as any).collection('home_banners').getFullList({ filter: `locale="${loc}" && active=true`, sort: 'sort_order,created' }),
        ($pb as any).collection('home_essence').getFirstListItem(`locale="${loc}" && active=true`),
        ($pb as any).collection('home_services').getFirstListItem(`locale="${loc}" && active=true`, { expand: 'service_1_icon,service_2_icon,service_3_icon,service_4_icon,service_5_icon,service_6_icon' }),
        ($pb as any).collection('home_benefits').getFirstListItem(`locale="${loc}" && active=true`, { expand: 'benefit_1_icon,benefit_2_icon,benefit_3_icon' }),
        ($pb as any).collection('home_supervision').getFirstListItem(`locale="${loc}" && active=true`),
        ($pb as any).collection('home_incidents').getFirstListItem(`locale="${loc}" && active=true`),
        ($pb as any).collection('home_laboratory').getFirstListItem(`locale="${loc}" && active=true`),
        ($pb as any).collection('home_laboratory_areas').getFullList({ filter: `locale="${loc}" && active=true`, expand: 'icon', sort: 'created' }),
        ($pb as any).collection('home_lab_certifications').getFirstListItem(`locale="${loc}" && active=true`),
        ($pb as any).collection('home_insurance').getFirstListItem(`locale="${loc}" && active=true`),
        ($pb as any).collection('home_insurance_types').getFullList({ filter: `locale="${loc}"`, sort: 'created' }).catch((e: any) => {
          if (isNotFound(e)) return ($pb as any).collection('home_insurance_types').getFullList({ sort: 'created' })
          throw e
        }),
        ($pb as any).collection('home_partners').getFirstListItem(`locale="${loc}" && active=true`),
        ($pb as any).collection('home_patrons_section').getFirstListItem(`locale="${loc}" && active=true`),
        ($pb as any).collection('home_patrons').getFullList({ filter: `locale="${loc}" && active=true`, sort: 'sort_order,created' }),
        ($pb as any).collection('home_cta').getFirstListItem(`locale="${loc}" && active=true`),
      ])

      // ponytail: single = 404 es "sin activos", otro error es fallo de red
      const single = (res: PromiseSettledResult<any>) => {
        if (res.status === 'fulfilled') return res.value as any
        if (!isNotFound(res.reason)) fetchFailed.value = true
        return null
      }
      const list = (res: PromiseSettledResult<any>) => {
        if (res.status === 'fulfilled' && Array.isArray(res.value)) return res.value as any[]
        // getFullList vacío resuelve [], solo rejected es fallo de red
        if (res.status === 'rejected') fetchFailed.value = true
        return []
      }

      const bannerList = list(bannersRes)
      banners.value = bannerList.map(mapBanner)

      essence.value = single(essenceRes)
      services.value = single(servicesRes)
      benefits.value = single(benefitsRes)
      supervision.value = single(supervisionRes)
      incidents.value = single(incidentsRes)
      laboratory.value = single(labRes)
      labAreas.value = list(labAreasRes)
      labCerts.value = single(labCertsRes)
      insuranceHeader.value = single(insuranceHeaderRes)
      insuranceTypes.value = list(insuranceTypesRes)
      partners.value = single(partnersRes)
      patronsSection.value = single(patronsSectionRes)
      patronRecords.value = list(patronsRes)
      cta.value = single(ctaRes)

      if (fetchFailed.value) error.value = 'Error fetching home content'

      // legacy sync for compat components still reading old state
      supervisionRecords.value = supervision.value ? [supervision.value as any] : []
      incidentRecords.value = incidents.value ? [incidents.value as any] : []
      partnerRecords.value = partners.value ? [partners.value as any] : []
      // keep textsMap empty — getText now reads new records
      textsMap.value = new Map()
      itemsByCategory.value = {}

    } catch (e: any) {
      error.value = e?.message || 'Error fetching home content'
    } finally {
      pending.value = false
      fetched.value = true
    }
  }

  return {
    banners,
    essence,
    services,
    benefits,
    supervision,
    incidents,
    laboratory,
    labAreas,
    labCerts,
    insuranceHeader,
    insuranceTypes,
    partners,
    patronsSection,
    patronRecords,
    cta,
    // legacy
    textsMap,
    itemsBySection,
    itemsByCategory,
    supervisionRecords,
    incidentRecords,
    partnerRecords,
    insuranceRecords,
    pending,
    error,
    fetched,
    fetchFailed,
    fetchHomeContent,
    getText,
    getSectionItems,
    getFileUrl,
    getInsuranceImageUrl,
    getPartnerLogoUrl,
    getPatronLogoUrl,
    getSupervisionImageUrl,
    getIncidentImageUrl,
    getPartnersImageUrls,
    getIncidentsImageUrls,
    resolveIconName,
    supervisionImageUrl,
  }
}
