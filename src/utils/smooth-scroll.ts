export default function smoothScroll(elementId: string, block: ScrollLogicalPosition, isSmooth: boolean = true ) {
    const element = document.getElementById( elementId )

    if (element)
        element.scrollIntoView({
            behavior: isSmooth ? 'smooth' : 'auto',
            block: block
        })
}