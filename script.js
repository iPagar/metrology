let decimals = null;
let dimension = null

function avg(values) {
    let total = 0;
    for (let i = 0; i < values.length; i++) {
        total += values[i];
    }
    const avg = total / values.length;

    return avg.toFixed(decimals)
}

function sd(values) {
    let total = 0;
    for (let i = 0; i < values.length; i++) {
        total += Math.pow(values[i] - avg(values), 2);
    }
    const sd = Math.sqrt(total / (values.length - 1));

    return sd.toFixed(decimals)
}

function gT() {
    const grabbs = 3.29

    return grabbs
}

function gMax(values) {
    const gMax = Math.abs(Math.max(...values) - avg(values)) / sd(values)

    return gMax.toFixed(decimals)
}

function gMin(values) {
    const gMin = Math.abs(Math.min(...values) - avg(values)) / sd(values)

    return gMin.toFixed(decimals)
}

function g(values, q) {
    const grabbs = gT()
    const min = gMin(values)
    const max = gMax(values)

    console.log(`x: ${values}`)
    console.log(`x': ${avg(values)}`)
    console.log(`Sx: ${sd(values)}`)
    console.log(`n: ${values.length}`)
    console.log(`q: ${q}`)
    console.log(`Gmin: ${min}`)
    console.log(`Gmax: ${max}`)
    console.log(`Gt: ${grabbs}`)

    $('#test').empty().append(createTableValues(values))
    $('#test').append(createFirst(values))
    $('#test').append(createSecond(values))
}

function createFirst(values) {
    let first = document.createElement('div')
    let formulaFirst = katex.renderToString('\\bar{x} = \\frac{1}{n}\\displaystyle\\sum_{i=1}^nx_{i} = \\frac{1}{' + values.length + '}(' + values[0] + ' + ... +' + values[values.length - 1] + ') = ' + avg(values) + '(' + dimension + ')');
    let formulaSecond = katex.renderToString('S_x = \\sqrt{\\frac{1}{n - 1}\\displaystyle\\sum_{i=1}^n(x_{i} - \\bar{x})^{2}} = \\sqrt{\\frac{1}{' + (values.length - 1) + '}(' + values[0] + '-' +
        avg(values) + ')^{2}' + ' + ... + (' + values[values.length - 1] + '-' +
        avg(values) + ')^{2}} = ' + sd(values) + '(' + dimension + ')');
    first.innerHTML = '<div style="display: block">1) Вычисляем x&#773; и S<sub>x</sub> результатов измерений</div> <div>' + formulaFirst + '</div>' + '<div>' + formulaSecond + '</div>'

    return first
}

function createSecond(values) {
    let first = document.createElement('div')
    let formulaFirst = katex.renderToString('x_{max} = ' + values[values.length - 1] + '(' + dimension + ')' + ' => G_{max} = \\frac{|x_{max} - \\bar{x}|}{S_x} = \\frac{|' + values[values.length - 1] + '-' + avg(values) + '|}{' + sd(values) + '} = ' + gMax(values));
    let formulaSecond = katex.renderToString('x_{min} = ' + values[0] + '(' + dimension + ')' + ' => G_{min} = \\frac{|x_{min} - \\bar{x}|}{S_x} = \\frac{|' + values[0] + '-' + avg(values) + '|}{' + sd(values) + '} = ' + gMin(values));

    first.innerHTML = '<div style="display: block">2) Выявляем результаты, содержащие грубые погрешности</div><div>n = 100, q = 0.05, => G<sub>t</sub> = ' + gT() + '<div>' + formulaFirst + '</div>'

    return first
}

function createTableValues(values) {
    let table = document.createElement('table')
    table.className = "table table-sm"
    let body = document.createElement('tbody')

    let tr = document.createElement('tr')
    tr.innerHTML = 'x<sub>i</sub>(' + dimension + ') = '
    body.appendChild(tr)

    for (let i = 0; i < values.length / 10; i++) {
        let tr = document.createElement('tr')
        for (let j = 0; j < values.length / 10; j++) {
            let td = document.createElement('td');
            td.innerHTML = values[Number(String(i) + String(j))].toFixed(decimals)
            tr.appendChild(td)
            body.appendChild(tr)
        }
    }

    table.appendChild(body)

    return table
}

$('#butt').bind('click', function() {
    const inputValues = $('#inputValues').val()
    let values = inputValues.replace(/,/g, '.').match(/[+-]?([0-9]*[.])?[0-9]+/g)
    decimals = values[0].toString().split('.').pop().length
    dimension = $('#dimension').val()
    values = values.map(value => Number(Number(value).toFixed(decimals)))
    console.log(values);
    const q = 0.05
    g(values, q)
});