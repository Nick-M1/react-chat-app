const subjectToColourMap = new Map([
    [ 'PE',          'bg-pink-50'],
    [ 'RE',          'bg-purple-50'],
    [ 'biology',     'bg-teal-50'],
    [ 'chemistry',   'bg-orange-50'],
    [ 'chinese',     'bg-lime-50'],
    [ 'classics',    'bg-sky-50'],
    [ 'english',     'bg-blue-50'],
    [ 'french',      'bg-green-50'],
    [ 'german',      'bg-rose-50'],
    [ 'history',     'bg-red-50'],
    [ 'italian',     'bg-emerald-50'],
    [ 'mathematics', 'bg-indigo-50'],
    [ 'physics',     'bg-cyan-50'],
    [ 'spanish',     'bg-yellow-50'],
])

export default function subjectToColour(subject: string): string {
    const colour = subjectToColourMap.get(subject);
    return typeof colour == 'undefined' ? 'bg-slate-50' : colour
}