const colorList = [
    'indigo-300',
    'teal-300',
    'orange-300',
    'lime-300',
    'pink-300',
    'cyan-300',
    'purple-300',
]
const colorListLength = colorList.length

export default function colorMapper(index: number) {
    return index < colorListLength ? colorList[index] : colorList[0]
}