let decimals = null
let dimension = null
let repeat = null
let values = []
let S = null
let n = null
let q = null
let N = null
const decimalsAdd = 2

function BC(barXValues) {
    let sum = 0
    for (let j = 0; j < S; j++)
        for (let i = 0; i < n; i++)
            sum += Math.pow((values[j][i] - barXValues[j]), 2)

    sum = sum / (N - S)

    return Number(sum.toFixed(decimals))
}

function MC(barXValues) {
    let sum = 0
    for (let j = 0; j < S; j++)
        sum += Math.pow((barXValues[j] - barX(barXValues)), 2)

    sum = (n * sum) / (S - 1)

    return Number(sum.toFixed(decimals))
}

function barX(barXValues) {
    let sum = 0
    for (let j = 0; j < S; j++)
        sum += barXValues[j]

    sum = sum / S

    return Number(sum.toFixed(decimals))
}

function F(barXValues) {
    return Number((MC(barXValues) / BC(barXValues)).toFixed(decimals))
}

function calc() {
    N = n * S
    let container = document.createElement('div')
    container.innerHTML = repeat + ') ' + 'Найдем внутрисерийную дисперсию' + '<br>'
    container.innerHTML += katex.renderToString('\\delta_{BC}^2= \\frac{1}{N - S} \\sum_{j=1}^{S} \\sum_{i=1}^{n} (x_{ij} - \\bar{x_{j}})^2') + '<br>'
    container.innerHTML += katex.renderToString('N = n \\times S = ' + N) + '<br>'
    container.innerHTML += katex.renderToString('\\bar{x_{j}} = \\frac{1}{n} \\sum_{i=1}^nx_{ij}') + '<br>'

    const barXValues = []
    for (let j = 0; j < S; j++) {
        let sum = 0
        let numbers = []

        for (let i = 0; i < n; i++) {
            sum += values[j][i]
            numbers.push(values[j][i])
        }
        const value = Number((sum / n).toFixed(decimals))
        container.innerHTML += katex.renderToString('\\bar{x_{' + (j + 1) + '}} = \\frac{1}{' + n + '} (' +
            numbers.map(value => value.toFixed(decimals)).toString().replace(/,/g, '+') + ') = ' + value.toFixed(decimals)) + '(' + dimension + ')' + '<br>'
        barXValues.push(value)
    }
    container.innerHTML += katex.renderToString('\\delta_{BC}^2 = \\frac{1}{' + (N - S) + '}') + '(' +
        values.map((j, index) => j.map(i => '(' + i + '-' + barXValues[index] + ')' + katex.renderToString('^2'))).toString().replace(/,/g, '+') + ') = ' +
        BC(barXValues).toFixed(decimals) + '(' + dimension + katex.renderToString('^2') + ')' + '<br>'

    container.innerHTML += ++repeat + ') ' + 'Найдем межсерийную дисперсию' + '<br>'
    container.innerHTML += katex.renderToString('\\delta_{MC}^2= \\frac{n}{S - 1} \\sum_{j=1}^{S} (\\bar{x_{j}} - \\bar{x})^2') + '<br>'
    container.innerHTML += katex.renderToString('\\bar{x} = \\frac{1}{S} \\sum_{j=1}^S \\bar{x_{j}} = ' + barX(barXValues).toFixed(decimals)) + '(' + dimension + ')' + '<br>'
    container.innerHTML += katex.renderToString('\\delta_{MC}^2 = \\frac{n}{' + (S - 1) + '} ') + '(' +
        barXValues.map((j, index) => '(' + barXValues[index] + '-' + barX(barXValues) + ')' + katex.renderToString('^2')).toString().replace(/,/g, '+') +
        ' ) =' + MC(barXValues).toFixed(decimals) + '(' + dimension + katex.renderToString('^2') + ')' + '<br>'

    container.innerHTML += ++repeat + ') ' + 'Наблюдаемое значение Фишера' + '<br>'
    container.innerHTML += katex.renderToString('F = \\frac{\\delta_{MC}^2}{\\delta_{BC}^2} = \\frac{' + MC(barXValues).toFixed(decimals) + '}{' + BC(barXValues).toFixed(decimals) + '} = ' + F(barXValues)) + '<br>'

    container.innerHTML += ++repeat + ') ' + 'Критическое значение критерия Фишера' + '<br>'
    container.innerHTML += 'q = ' + q + '<br>'
    const k1 = S - 1
    const k2 = N - S
    container.innerHTML += katex.renderToString('k_1 = S - 1 = ' + k1) + '<br>'
    container.innerHTML += katex.renderToString('k_2 = N - S = ' + k2) + '<br>'
    const Fq = prompt('Введите Fq, при q = ' + q + ', k1 = ' + k1 + ', k2 = ' + k2)
    container.innerHTML += katex.renderToString('F_q = ' + Fq) + '<br>'

    container.innerHTML += ++repeat + ') ' + 'Проверка гипотезы' + '<br>'
    F(barXValues) > Fq ?
        container.innerHTML += katex.renderToString('F > F_q => ') + 'нет оснований отвергнуть гипотезу об отсутствии постоянных систематических погрешностей' + '<br>' :
        container.innerHTML += katex.renderToString('F \\le F_q => ') + 'есть основания отвергнуть гипотезу об отсутствии постоянных систематических погрешностей' + '<br>'

    $('#test').append(container)
}

function createTableValues() {
    let table = document.createElement('table')
    table.className = "table table-sm"
    let body = document.createElement('tbody')
    let tr = document.createElement('tr')
    tr.innerHTML = 'x<sub>i</sub>(' + dimension + ') = '
    body.appendChild(tr)

    for (let i = 0; i < n; i++) {
        let tr = document.createElement('tr')
        for (let j = 0; j < S; j++) {
            let td = document.createElement('td');

            td.innerHTML = values[j][i].toFixed(decimals)
            tr.append(td)
        }
        body.appendChild(tr)
    }

    table.appendChild(body)
    return table
}

function showValues() {
    let table = createTableValues()
    let container = document.createElement('div')
    container.append('Дано:')
    container.append(document.createElement('br'))
    container.append(table)
    container.append('S = ' + S)
    container.innerHTML += '<br>'
    container.append('n = ' + n)
    $('#defaultValues').append(container)
}

function getInputValues() {
    const inputValues = $('#inputValues').val().replace(/,/g, '.').match(/[+-]?([0-9]*[.])?[0-9]+/g)
    dimension = $('#dimension').val()
    S = Number($('#S').val())
    n = Number($('#n').val())
    q = Number($('#q').val())
    for (let i = 0; i < S; i++) {
        values[i] = []

        for (let j = 0; j < n; j++)
            values[i][j] = Number(inputValues[j * S + i])
    }
    decimals = values[0][0].toString().split('.').pop().length + decimalsAdd
    repeat = 1
}

$('#send').bind('click', function() {
    getInputValues()
    $('#test').empty()
    $('#defaultValues').empty()
    showValues()
    $('#test').append("Решение:")
    calc()
});