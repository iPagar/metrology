let decimals = null;
let dimension = null
let repeat = null
let values = null
let q = null
let grabbs = null

function avg() {
    let total = 0;
    for (let i = 0; i < values.length; i++) {
        total += values[i];
    }
    const avg = total / values.length;

    return avg.toFixed(decimals)
}

function sd() {
    let total = 0;
    for (let i = 0; i < values.length; i++) {
        total += Math.pow(values[i] - avg(values), 2);
    }
    const sd = Math.sqrt(total / (values.length - 1));

    return sd.toFixed(decimals)
}

function gT() {
    grabbs = prompt(`Введите критерий граббса при n = ${values.length}, q = ${q}`)
}

function gMax() {
    const gMax = Math.abs(Math.max(...values) - avg(values)) / sd(values)

    return gMax.toFixed(2)
}

function gMin() {
    const gMin = Math.abs(Math.min(...values) - avg(values)) / sd(values)

    return gMin.toFixed(2)
}

function g() {
    gT()
    const min = gMin()
    const max = gMax()
    let error = false

    console.log(`x: ${values}`)
    console.log(`x': ${avg(values)}`)
    console.log(`Sx: ${sd(values)}`)
    console.log(`n: ${values.length}`)
    console.log(`q: ${q}`)
    console.log(`Gmin: ${min}`)
    console.log(`Gmax: ${max}`)
    console.log(`Gt: ${grabbs}`)

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
    let formulaFirst = katex.renderToString('\\bar{x} = \\frac{1}{n}\\displaystyle\\sum_{i=1}^nx_{i} = \\frac{1}{' + values.length + '}(' + values[0] + ' + ... +' + values[values.length - 1] + ') = ' + avg(values) + '(' + dimension + ')');
    let formulaSecond = katex.renderToString('S_x = \\sqrt{\\frac{1}{n - 1}\\displaystyle\\sum_{i=1}^n(x_{i} - \\bar{x})^{2}} = \\sqrt{\\frac{1}{' + (values.length - 1) + '}(' + values[0] + '-' +
        avg(values) + ')^{2}' + ' + ... + (' + values[values.length - 1] + '-' +
        avg(values) + ')^{2}} = ' + sd(values) + '(' + dimension + ')');
    first.innerHTML = '<div style="display: block">' + repeat + ') Вычисляем x̅ и S<sub>x</sub> результатов измерений</div> <div>' + formulaFirst + '</div>' + '<div>' + formulaSecond + '</div>'

    return first
}

function createSecond() {
    let first = document.createElement('div')
    let formulaFirst = katex.renderToString('x_{max} = ' + values[values.length - 1].toFixed(2) + '(' + dimension + ')' + ' => G_{max} = \\frac{|x_{max} - \\bar{x}|}{S_x} = \\frac{|' + values[values.length - 1].toFixed(2) + '-' + avg(values) + '|}{' + sd(values) + '} = ' + Number(gMax(values)).toFixed(2));
    let formulaSecond = katex.renderToString('x_{min} = ' + values[0].toFixed(2) + '(' + dimension + ')' + ' => G_{min} = \\frac{|x_{min} - \\bar{x}|}{S_x} = \\frac{|' + values[0].toFixed(2) + '-' + avg(values) + '|}{' + sd(values) + '} = ' + Number(gMin(values)).toFixed(2));

    first.innerHTML = '<div style="display: block">' + ++repeat + ') Выявляем результаты, содержащие грубые погрешности</div><div>n = ' + values.length + ', q = 0.05, => G<sub>t</sub> = ' + grabbs + '<div>' + formulaFirst + '</div>' + '<div>' + formulaSecond + '</div>'

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

$('#butt').bind('click', function() {
    values = $('#inputValues').val().replace(/,/g, '.').match(/[+-]?([0-9]*[.])?[0-9]+/g)
    decimals = Math.max(...values).toString().split('.').pop().length
    dimension = $('#dimension').val()
    values = values.map(value => Number(Number(value).toFixed(decimals)))
    q = $('#q').val()
    repeat = 1
    $('#test').empty()
    g()
});