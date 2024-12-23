let radioUnit = document.querySelectorAll("[name='unit_type']")
let result = document.getElementById('bmi_result')
let suggests = document.getElementById('suggests')
let form = document.querySelector('form')
let input = form.querySelectorAll('input[type="text"]')
let info = document.querySelector('.info')
let bmiMachine = {
    unitType: 'met',
    bmi: 0,
    sg_min: 0,
    sg_max: 0,
    data: {},
    isValid: () => {
        if (!bmiMachine.data) return false
        if (bmiMachine.unitType == 'met') return bmiMachine.data.kg && bmiMachine.data.cm;
        return (bmiMachine.data.st || bmiMachine.data.lbs) && (bmiMachine.data.ft || bmiMachine.data.inc);
    },
    checkGreatThanZero: () => {
        return bmiMachine.data.kg > 0 && bmiMachine.data.cm > 0
    },
    changeType: (e) => {
        form.setAttribute('unit_type', e.target.value)
        bmiMachine.unitType = e.target.value
    },
    tranformMetric: () => {
        bmiMachine.data.cm = (parseFloat(bmiMachine.data.ft || 0) * 0.3048 + parseFloat(bmiMachine.data.inc || 0) * 0.0254) * 100
        bmiMachine.data.kg = parseFloat(bmiMachine.data.st || 0) * 6.35029 + parseFloat(bmiMachine.data.lbs || 0) * 0.453592
    },
    tranformPound: () => {
        bmiMachine.sg_min = bmiMachine.sg_min / 0.453592
        bmiMachine.sg_max = bmiMachine.sg_max / 0.453592
    },
    caculate: () => {
        if (bmiMachine.unitType == 'imp') bmiMachine.tranformMetric()
        if (!bmiMachine.checkGreatThanZero()) return false;
        bmiMachine.bmi = bmiMachine.data.kg / Math.pow(bmiMachine.data.cm / 100, 2)
        bmiMachine.suggests()
    },
    suggests: () => {
        bmiMachine.sg_min = 18.5 * Math.pow(bmiMachine.data.cm / 100, 2)
        bmiMachine.sg_max = 24.9 * Math.pow(bmiMachine.data.cm / 100, 2)
        if (bmiMachine.unitType == 'imp') bmiMachine.tranformPound()
    }
}

let handleInput = () => {

    bmiMachine.data = Object.fromEntries(new FormData(form))
    if (!bmiMachine.isValid()) return false
    bmiMachine.caculate()
    result.textContent = bmiMachine.bmi.toFixed(2)
    let suggestsUnit = bmiMachine.unitType == 'met' ? 'kg' : 'lbls'
    suggests.textContent = `${bmiMachine.sg_min.toFixed(2)}${suggestsUnit} - ${bmiMachine.sg_max.toFixed(2)}${suggestsUnit}`
    info.removeAttribute('empty')
}
input.forEach(el => el.addEventListener('input', handleInput))
radioUnit.forEach(el => el.addEventListener('click', (e) => bmiMachine.changeType(e)))