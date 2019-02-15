let decimals = null;
let dimension = null
let repeat = null
let values = null
let q = null
let grabbs = null
let system = null
let borderSystem = null

function showCorrection() {
    let container = document.createElement('div')
    container.id = "correction"

    const skoSystem = katex.renderToString('S_{\\Theta} = \\frac{\\Theta}{\\sqrt{3}}=' + sdSystem() + '(' + dimension + ')');
    container.innerHTML = ++repeat + ') Введение поправки<br>' + skoSystem + '<br>' + ++repeat + ') Проверка условия введения поправки<br>'
    container.innerHTML += katex.renderToString('|с| > 0.5\\frac{S_{\\Theta}^2}{S_x} => ')
    if (checkCorrection()) {
        container.innerHTML += katex.renderToString(Math.abs(system).toFixed(decimals) + '>' + (Math.pow(sdSystem(), 2) / sd()).toFixed(decimals)) + '<br>Условия выполнены<br>'
        container.innerHTML += ++repeat + ') Введение поправки<br>' + katex.renderToString('x = x + c = ' + (Number(avg()) + Number(system)).toFixed(decimals) + '(' + dimension + ')')
    } else { container.innerHTML += (katex.renderToString(Math.abs(system).toFixed(decimals) + '\\le' + (Math.pow(sdSystem(), 2) / sd()).toFixed(decimals)) + '<br>Условия не выполнены') }

    $('#test').append(container)
}

function sdSystem() {
    const sko = borderSystem / Math.sqrt(3)

    return sko.toFixed(decimals)
}

function checkCorrection() {
    const check = (Math.abs(system) > 0.5 * (Math.pow(sdSystem(), 2) / sd()))

    return check
}

function pirson() {

}

function showPirson() {

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
    grabbs = prompt(`Введите критерий граббса при n = ${values.length}, q = ${q}`)
}

function gMax() {
    const gMax = Math.abs(Math.max(...values) - avg()) / sd(values)

    return gMax.toFixed(2)
}

function gMin() {
    const gMin = Math.abs(Math.min(...values) - avg()) / sd()

    return gMin.toFixed(2)
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
    let formulaFirst = katex.renderToString('\\bar{x} = \\frac{1}{n}\\displaystyle\\sum_{i=1}^nx_{i} = \\frac{1}{' + values.length + '}(' + values[0] + ' + ... +' + values[values.length - 1] + ') = ' + avg() + '(' + dimension + ')');
    let formulaSecond = katex.renderToString('S_x = \\sqrt{\\frac{1}{n - 1}\\displaystyle\\sum_{i=1}^n(x_{i} - \\bar{x})^{2}} = \\sqrt{\\frac{1}{' + (values.length - 1) + '}(' + values[0] + '-' +
        avg() + ')^{2}' + ' + ... + (' + values[values.length - 1] + '-' +
        avg(values) + ')^{2}} = ' + sd(values) + '(' + dimension + ')');
    first.innerHTML = '<div style="display: block">' + repeat + ') Вычисляем x̅ и S<sub>x</sub> результатов измерений</div> <div>' + formulaFirst + '</div>' + '<div>' + formulaSecond + '</div>'

    return first
}

function createSecond() {
    let first = document.createElement('div')
    let formulaFirst = katex.renderToString('x_{max} = ' + values[values.length - 1].toFixed(2) + '(' + dimension + ')' + ' => G_{max} = \\frac{|x_{max} - \\bar{x}|}{S_x} = \\frac{|' + values[values.length - 1].toFixed(2) + '-' + avg(values) + '|}{' + sd(values) + '} = ' + Number(gMax()).toFixed(2));
    if (gMax() > grabbs)
        formulaFirst += katex.renderToString(' => G_{max} > G_t,~значит~G_{max}~является~грубой~погрешностью')
    else
        formulaFirst += katex.renderToString(' => G_{max} \\le G_t,~значит~G_{max}~не~является~грубой~погрешностью')

    let formulaSecond = katex.renderToString('x_{min} = ' + values[0].toFixed(2) + '(' + dimension + ')' + ' => G_{min} = \\frac{|x_{min} - \\bar{x}|}{S_x} = \\frac{|' + values[0].toFixed(2) + '-' + avg(values) + '|}{' + sd(values) + '} = ' + Number(gMin()).toFixed(2));

    if (gMin() > grabbs)
        formulaSecond += katex.renderToString(' => G_{min} > G_t,~значит~G_{min}~является~грубой~погрешностью')
    else
        formulaSecond += katex.renderToString(' => G_{min} \\le G_t,~значит~G_{min}~не~является~грубой~погрешностью')

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
        td.innerHTML = values[i].toFixed(decimals)
        body.children[body.children.length - 1].appendChild(td)

    }

    table.appendChild(body)

    return table
}

function calc() {
    g()
    if (system)
        showCorrection()
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
    decimals = Math.max(...values).toString().split('.').pop().length
    dimension = $('#dimension').val()
    values = values.map(value => Number(Number(value).toFixed(decimals)))
    q = $('#q').val()
    system = Number(($('#system').val()).replace(/,/g, '.').match(/[+-]?([0-9]*[.])?[0-9]+/g))
    borderSystem = Number(($('#borderSystem').val()).replace(/,/g, '.').match(/[+-]?([0-9]*[.])?[0-9]+/g))
    repeat = 1
}

$('#send').bind('click', function() {
    getInputValues()
    showValues()
    $('#inputForm').hide()
    $('#test').empty()
    $('#test').append("Решение:")
    calc()
});