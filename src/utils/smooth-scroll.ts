export default function smoothScroll(elementId: string, block: ScrollLogicalPosition, highlight: boolean = false ) {
    const element = document.getElementById( elementId )

    if (element) {
        // Scroll
        element.scrollIntoView({
            behavior: 'smooth',
            block: block
        })

        // Highlight
        if (highlight) {
            const originalClassname = element.className
            element.className = originalClassname + ' bg-blue-900/50'
            setTimeout(() => element.className = originalClassname, 1000)
        }
    }
}