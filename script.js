let decimals = null
let dimension = null
let repeat = null
let values = null
let q = null
let grabbs = null
let system = null
let borderSystem = null
let p = 0.95
const decimalsAdd = 2

function showResult() {
    let container = document.createElement('div')
    container.id = "result"

    const kvantilStudenta = prompt('Введите квантиль стьюдента при ' + 'n = ' + values.length + ', p = 0.95')
    const epsilon = (kvantilStudenta * sdX()).toFixed(decimals)
    container.innerHTML += ++repeat + ') Результат измерений<br>'

    if (checkCorrection()) {
        const k = ((epsilon * borderSystem) / (sdX() * sdSystem())).toFixed(decimals)
        const skoSum = (Math.sqrt(sdX() * sdX() + sdSystem() * sdSystem())).toFixed(decimals)
        const delta = (k * skoSum).toFixed(decimals)

        container.innerHTML += katex.renderToString('x = \\bar{x} \\pm \\Delta') + ', p = ' + p + '<br>'
        container.innerHTML += 'n = ' + values.length + ', p = 0.95 =>' + katex.renderToString('t_{\\frac{1+p}{2}}(n-1)=') + kvantilStudenta + '<br>'
        container.innerHTML += katex.renderToString('S_{\\bar{x}} = \\frac{S_{x}}{\\sqrt{n}} = \\frac{' + sd() + '}{\\sqrt{' + values.length + '}}=' + sdX()) + '(' + dimension + ')' + '<br>'
        container.innerHTML += katex.renderToString('\\pm\\varepsilon=\\pm t_{\\frac{1+p}{2}}(n-1)\\times S_{\\bar{x}}=\\pm(' + kvantilStudenta + '\\times' + sdX() + ')=\\pm(' + epsilon + ')') + '(' + dimension + ')' +
            '<br>'
        container.innerHTML += katex.renderToString('k = \\frac{\\varepsilon + \\Theta_{sum}}{S_{\\bar{x}} + S_{\\Theta}}= \\frac{' + epsilon + '+ ' + borderSystem + '}{' + sdX() + '+' + sdSystem() + '}=' + k) + '<br>'
        container.innerHTML += katex.renderToString('S_{\\sum} = \\sqrt{S_{\\bar{x}}^2 + S_{\\Theta}^2} = \\sqrt{' + (Math.pow(sdX(), 2)).toFixed(decimals) + '^2 + ' + (Math.pow(sdSystem(), 2)).toFixed(decimals) + '^2}=' + skoSum) + '<br>'
        container.innerHTML += katex.renderToString('\\Delta = k * S_{\\sum}=' + delta) + '<br>'

        container.innerHTML += 'x = (' + avg() + katex.renderToString('\\pm') + delta + ')' + dimension +
            ', p = ' + p + '<br>'
    } else {
        container.innerHTML += katex.renderToString('x = \\bar{x} \\pm t_{\\frac{1+p}{2}}(n-1)\\times S_x') + ', p = ' + p + '<br>'
        container.innerHTML += 'n = ' + values.length + ', p = 0.95 =>' + katex.renderToString('t_{\\frac{1+p}{2}}(n-1)=') + kvantilStudenta + '<br>'
        container.innerHTML += katex.renderToString('S_{\\bar{x}} = \\frac{S_{x}}{\\sqrt{n}} = \\frac{' + sd() + '}{\\sqrt{' + values.length + '}}=' + sdX()) + '(' + dimension + ')' + '<br>'
        container.innerHTML += 'x = (' + avg() + katex.renderToString('\\pm') + epsilon + ')' + dimension +
            ', p = ' + p + '<br>'
    }

    $('#test').append(container)
}

function showCorrection() {
    let container = document.createElement('div')
    container.id = "correction"
    const skoSystem = katex.renderToString('S_{\\Theta} = \\frac{\\Theta}{\\sqrt{3}} = \\frac{' + borderSystem + '}{\\sqrt{3}}=' + sdSystem()) + '(' + dimension + ')'
    container.innerHTML = ++repeat + ') Исключение систематической погрешности путем введения поправок<br>' + skoSystem + '<br>' + ++repeat + ') Проверка условия введения поправки<br>'
    container.innerHTML += katex.renderToString('|c| > 0.5\\frac{S_{\\Theta}^2}{S_x} = |' + system + '|' + ' > 0.5\\frac{' + sdSystem() + '^2}{' + sd() + '} =>')
    if (checkCorrection()) {
        container.innerHTML += katex.renderToString(Math.abs(system) + '>' + Number(0.5 * (Math.pow(sdSystem(), 2) / sd())).toFixed(decimals)) + ' => условия выполнены<br>';
        container.innerHTML += ++repeat + ') Введение поправки<br>' + katex.renderToString('\\bar{x}\' - ') + 'неисправленный результат<br>' +
            katex.renderToString('\\bar{x} = \\bar{x}\' + c = ' + avg() + (+system).toFixed(decimals) + '=' + (+avg() + (+system)).toFixed(decimals)) + '(' + dimension + ')'
    } else { container.innerHTML += katex.renderToString(Math.abs(system) + '\\le' + Number(0.5 * (Math.pow(sdSystem(), 2) / sd())).toFixed(decimals)) + ' => условия не выполнены' }
    $('#test').append(container)
}

function sdX() {
    const sdX = sd() / Math.sqrt(values.length)

    return sdX.toFixed(decimals)
}

function sdSystem() {
    const sko = borderSystem / Math.sqrt(3)
    return sko.toFixed(decimals)
}

function checkCorrection() {
    const check = (Math.abs(system) > 0.5 * (Math.pow(sdSystem(), 2) / sd()))
    return check
}

function avg() {
    let total = 0;
    for (let i = 0; i < values.length; i++) {
        total += values[i];
    }
    let avg = total / values.length;
    return avg.toFixed(decimals)
}

function sd() {
    let total = 0;
    for (let i = 0; i < values.length; i++) {
        total += Math.pow(values[i] - avg(), 2);
    }
    const sd = Math.sqrt(total / (values.length - 1));
    return sd.toFixed(decimals)
}

function gT() {
    const n = values.length

    if (q === 0.05 & n > 75) {
        grabbs = 3.29;

    } else {
        grabbs = prompt(`Введите критерий граббса при n = ${n}, q = ${q}`)
    }
}

function gMax() {
    const gMax = Math.abs(Math.max(...values) - avg()) / sd()
    return gMax.toFixed(decimals)
}

function gMin() {
    const gMin = Math.abs(Math.min(...values) - avg()) / sd()
    return gMin.toFixed(decimals)
}

function g() {
    gT()
    const min = gMin()
    const max = gMax()
    let error = false
    let container = document.createElement('div')
    container.id = repeat
    $('#test').append(container)
    $('#' + repeat).append(createTableValues())
    $('#' + repeat).append(createFirst())
    $('#' + repeat).append(createSecond())
    if (min > grabbs) {
        error = true
        values.shift()
    }
    if (max > grabbs) {
        error = true
        values.pop()
    }
    if (error) {
        repeat++
        g()
    }
}

function createFirst() {
    let first = document.createElement('div')
    let formulaFirst = katex.renderToString('\\bar{x} = \\frac{1}{n}\\displaystyle\\sum_{i=1}^nx_{i} = \\frac{1}{' + values.length + '}(' + values[0] + ' + ... +' + values[values.length - 1] + ') = ' + avg()) + '(' + dimension + ')';
    let formulaSecond = katex.renderToString('S_x = \\sqrt{\\frac{1}{n - 1}\\displaystyle\\sum_{i=1}^n(x_{i} - \\bar{x})^{2}} = \\sqrt{\\frac{1}{' + (values.length - 1) + '}(' + values[0] + '-' +
        avg() + ')^{2}' + ' + ... + (' + values[values.length - 1] + '-' +
        avg() + ')^{2}} = ' + sd()) + '(' + dimension + ')';
    first.innerHTML = '<div style="display: block">' + repeat + ') Вычисляем x̅ и S<sub>x</sub> результатов измерений</div> <div>' + formulaFirst + '</div>' + '<div>' + formulaSecond + '</div>'
    return first
}

function createSecond() {
    let first = document.createElement('div')
    let formulaFirst = katex.renderToString('x_{max} = ' + Math.abs(Math.max(...values))) + '(' + dimension + ')' + katex.renderToString(' => G_{max} = \\frac{|x_{max} - \\bar{x}|}{S_x} = \\frac{|' + values[values.length - 1] + '-' + avg() + '|}{' + sd() + '} = ') + gMax();
    if (gMax() > grabbs)
        formulaFirst += katex.renderToString('~=>~G_{max} > G_t~=>~x_{max}') + 'содержит грубую погрешность';
    else
        formulaFirst += katex.renderToString(' => G_{max} \\le G_t~=>~x_{max}') + 'не содержит грубую погрешность';
    let formulaSecond = katex.renderToString('x_{min} = ' + Math.abs(Math.min(...values))) + '(' + dimension + ')' + katex.renderToString('~=>~G_{min} = \\frac{|x_{min} - \\bar{x}|}{S_x} = \\frac{|' + values[0] + '-' + avg() + '|}{' + sd() + '} = ') + gMin();
    if (gMin() > grabbs)
        formulaSecond += katex.renderToString(' => G_{min} > G_t~=>~x_{min}') + 'содержит грубую погрешность';
    else
        formulaSecond += katex.renderToString(' => G_{min} \\le G_t~=>~x_{min}') + 'не содержит грубую погрешность';
    first.innerHTML = '<div style="display: block">' + ++repeat + ') Выявляем результаты, содержащие грубые погрешности</div><div>n = ' + values.length + ', q = ' + q + ', => G<sub>t</sub> = ' + grabbs + '<div>' + formulaFirst + '</div>' + '<div>' + formulaSecond + '</div>'
    return first
}

function createTableValues() {
    let table = document.createElement('table')
    table.className = "table table-sm"
    let body = document.createElement('tbody')
    let tr = document.createElement('tr')
    tr.innerHTML = 'x<sub>i</sub>(' + dimension + ') = '
    body.appendChild(tr)
    for (let i = 0; i < values.length; i++) {
        if (i % 10 == 0) {
            let tr = document.createElement('tr')
            body.appendChild(tr)
        }
        let td = document.createElement('td');
        td.innerHTML = values[i].toFixed(decimals - decimalsAdd)
        body.children[body.children.length - 1].appendChild(td)
    }
    table.appendChild(body)
    return table
}

function calc() {
    g()
    if (system && borderSystem)
        showCorrection()
    showResult()
}

function showValues() {
    let table = createTableValues()
    let container = document.createElement('div')
    container.append('Дано:')
    container.append(document.createElement('br'))
    container.append(table)
    container.append('q = ' + q)
    $('#defaultValues').append(container)
}

function getInputValues() {
    values = $('#inputValues').val().replace(/,/g, '.').match(/[+-]?([0-9]*[.])?[0-9]+/g)
    decimals = Math.max(...values).toString().split('.').pop().length + decimalsAdd
    dimension = $('#dimension').val()
    values = values.map(value => Number(value))
    q = Number($('#q').val())
    system = Number(($('#system').val()).replace(/,/g, '.').match(/[+-]?([0-9]*[.])?[0-9]+/g))
    borderSystem = Number(($('#borderSystem').val()).replace(/,/g, '.').match(/[+-]?([0-9]*[.])?[0-9]+/g))
    repeat = 1
}

$('#send').bind('click', function() {
    getInputValues()
    showValues()
    $('#test').empty()
    $('#defaultValues').empty()
    $('#test').append("Решение:")
    calc()
});