import { useEffect } from 'react'

export const SITE_TITLE = 'Marc Bastien | Cloud & AI Engineer'

// Sets <title> for the current page; no argument means the home title.
const useDocumentTitle = (title) => {
  useEffect(() => {
    document.title = title ? `${title} | Marc Bastien` : SITE_TITLE
  }, [title])
}

export default useDocumentTitle
