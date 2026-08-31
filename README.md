# Nuxt Starter Template

[![Nuxt UI](https://img.shields.io/badge/Made%20with-Nuxt%20UI-00DC82?logo=nuxt&labelColor=020420)](https://ui.nuxt.com)

Use this template to get started with [Nuxt UI](https://ui.nuxt.com) quicklyy.

- [Live demo](https://starter-template.nuxt.dev/)
- [Documentation](https://ui.nuxt.com/docs/getting-started/installation/nuxt)

<a href="https://starter-template.nuxt.dev/" target="_blank">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="https://ui.nuxt.com/assets/templates/nuxt/starter-dark.png">
    <source media="(prefers-color-scheme: light)" srcset="https://ui.nuxt.com/assets/templates/nuxt/starter-light.png">
    <img alt="Nuxt Starter Template" src="https://ui.nuxt.com/assets/templates/nuxt/starter-light.png" width="830" height="466">
  </picture>
</a>

> The starter template for Vue is on https://github.com/nuxt-ui-templates/starter-vue.

## Quick Start

```bash [Terminal]
npm create nuxt@latest -- -t github:nuxt-ui-templates/starter
```

## Deploy your own

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-name=starter&repository-url=https%3A%2F%2Fgithub.com%2Fnuxt-ui-templates%2Fstarter&demo-image=https%3A%2F%2Fui.nuxt.com%2Fassets%2Ftemplates%2Fnuxt%2Fstarter-dark.png&demo-url=https%3A%2F%2Fstarter-template.nuxt.dev%2F&demo-title=Nuxt%20Starter%20Template&demo-description=A%20minimal%20template%20to%20get%20started%20with%20Nuxt%20UI.)

## Setup

Make sure to install the dependencies:

```bash
pnpm install
```

## Development Server

Start the development server on `http://localhost:3000`:

```bash
pnpm dev
```

## Production

Build the application for production:

```bash
pnpm build
```

Locally preview production build:

```bash
pnpm preview
```

Check out the [deployment documentation](https://nuxt.com/docs/getting-started/deployment) for more information.



# Cubacontrol landing

This repository contains the **Cubacontrol landing backend**, built with **Pocketbase** and designed for deployment on Render.

---

## 🚀 Deployment Steps

Follow these exact steps to build, tag, and push the Docker image:

```bash
sudo docker build -t landing-cubacontrol .
sudo docker tag landing-cubacontrol alfiguez/landing-cubacontrol:latest
sudo docker push alfiguez/landing-cubacontrol:latest






Implementation Plan: Dynamic Home Content via PocketBase
1. PocketBase Configuration (Backend)
A. Create Collection: home_content
Create a new collection in your PocketBase instance with the following schema:
Field Name
Type
Required
Description
Example Value
section_id
text
✅
Unique identifier for the section
"hero_banner", "services"
title
text
❌
Main heading
"Our Services"
subtitle
text
❌
Secondary heading
"Quality you can trust"
description
text
❌
Main body text (supports simple HTML)
"<p>We offer...</p>"
button_label
text
❌
CTA button text
"Learn More"
button_url
text
❌
CTA button link
"/services"
image_main
file
❌
Primary image for the section
(Upload file)
image_secondary
file
❌
Secondary image (cards, etc.)
(Upload file)
items
json
❌
Array of objects for lists/grids
[{"title": "...", "icon": "..."}]
is_active
bool
✅
Toggle to show/hide section
true
API Rules Configuration:
List/View: true (Public access is required for the frontend to fetch data).
Create/Update/Delete: @request.auth.id != "" (Only authenticated admins can modify).
B. Seed Initial Data
Populate the home_content collection with records corresponding to your current static content.
Strategy: Copy the exact text and image filenames currently hardcoded in your Vue components into these new records.
Example Record (Services):
section_id: "services"
title: "Nuestros Servicios"
items: [{"title": "Inspection", "icon": "clipboard"}, {"title": "Lab", "icon": "flask"}]
2. Frontend Implementation (Nuxt 3 / Vue 3)
A. Create Service Layer (services/home.services.ts)
Create a dedicated service to handle PocketBase queries.
typescript

// services/home.services.ts
import { getPb } from '~/utils/pocketbase' // Adjust path to your PB utility

export const getHomeContent = async (sectionId: string) => {
  try {
    const pb = getPb()
    // Fetch single record by section_id
    const record = await pb.collection('home_content').getFirstListItem(`section_id="${sectionId}" && is_active=true`)
    return record
  } catch (error) {
    console.error(`Error loading section ${sectionId}:`, error)
    return null
  }
}

export const getAllHomeContent = async () => {
  try {
    const pb = getPb()
    // Fetch all active records
    const records = await pb.collection('home_content').getFullList({ 
      sort: 'created', 
      filter: 'is_active=true' 
    })
    
    // Map records by section_id for easy access: { "services": {...}, "hero": {...} }
    return records.reduce((acc: any, item: any) => {
      acc[item.section_id] = item
      return acc
    }, {})
  } catch (error) {
    console.error('Error loading home content:', error)
    return {}
  }
}

12345678910111213141516171819202122232425262728293031323334
B. Create Server API Endpoint (Optional but Recommended for SSR)
Create an endpoint to fetch data server-side for better SEO and initial load performance.
typescript

// server/api/home-content.get.ts
import { getPb } from '~/server/utils/pocketbase' // Adjust path to server PB utility

export default defineEventHandler(async (event) => {
  try {
    const pb = getPb()
    const records = await pb.collection('home_content').getFullList({ 
      sort: 'created', 
      filter: 'is_active=true' 
    })
    
    const contentMap = records.reduce((acc: any, item: any) => {
      acc[item.section_id] = item
      return acc
    }, {})
    
    return { success: true, data: contentMap }
  } catch (error) {
    console.error('API Error:', error)
    return { success: false, data: {} }
  }
})

12345678910111213141516171819202122
C. Update Components
General Strategy for Each Component:
Define Props: Add a content prop to receive dynamic data.
Fallback Logic: Use props.content if available; otherwise, fallback to existing static/i18n data to prevent breaking if PocketBase is down.
Image URLs: Construct full URLs using the pattern:
${PB_URL}/api/files/${COLLECTION_ID}/${RECORD_ID}/${FILENAME}
Template Binding: Replace hardcoded text ({{ $t('key') }}) with {{ content.title }}.
Files to Modify:
app/pages/index.vue
Action: Call getAllHomeContent() (or fetch from /api/home-content) in onMounted or useFetch.
Action: Pass the specific section data to child components via props.
Example: <HomeServices :content="homeData.services" />
app/components/home/HomeServices.vue
Prop: content (Object)
Logic: Render list from content.items. Fallback to static list if content is null.
Template: v-for="item in content?.items || staticItems"
app/components/home/HomeLaboratorio.vue
Prop: content
Logic: Bind content.description, content.title, and construct image URL from content.image_main.
app/components/home/HomeSeguros.vue
Prop: content
Logic: Iterate over content.items for insurance cards.
app/components/home/HomeImportancia.vue
Prop: content
Logic: Bind title and description fields.
app/components/home/HomeTextSupervision.vue
Prop: content
Logic: Bind supervisionTitle, supervisionDescription, supervisionNote.
app/components/home/HomePartners.vue
Prop: content
Logic: Iterate over content.items for partner logos.
app/components/home/HomeInsidencias.vue & HomePatrons.vue
Prop: content
Logic: Same pattern as above.
3. Image Handling Specifics
PocketBase returns only the filename in the JSON response. You must construct the full URL in the frontend.
Helper Function (Optional):
typescript

export const getPbImageUrl = (record: any, fieldName: string) => {
  if (!record || !record[fieldName]) return '/placeholder.png'
  const pb = getPb()
  return pb.files.getUrl(record, record[fieldName])
}

12345
Usage in Template:
html

<img :src="getPbImageUrl(content, 'image_main')" :alt="content.title" />

1
4. Workflow Summary
Admin Action: User logs into PocketBase Admin UI.
Edit: User modifies text or uploads a new image in the home_content collection for a specific section_id.
Save: Record is updated.
Frontend Fetch:
On Load: Nuxt fetches the latest JSON via the API endpoint.
Reactivity: If using client-side fetching, the UI updates automatically upon promise resolution.
Render: Vue components display the new content immediately.
5. Critical Notes for the Agent
JSON Structure: The structure of the items JSON field in PocketBase must exactly match the structure of the static arrays currently used in the Vue components (e.g., if the code expects item.icon, the JSON must have an icon key).
Error Handling: Always implement a fallback to static data. If PocketBase is unreachable, the site should still display the default content, not a blank screen.
Caching: Consider implementing a simple cache or re-fetch strategy if content updates need to be reflected instantly without a page refresh (though PocketBase real-time subscriptions can also be used for advanced scenarios).