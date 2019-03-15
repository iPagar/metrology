let decimals
let q
let values
let decimalsAdd = 2
let dimension
let repeat

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

function granicaTable(r, min, max, h) {
    let table = document.createElement('table')
    table.className = "table table-sm"
    let body = document.createElement('tbody')

    let tr = document.createElement('td')
    tr.innerHTML = 'j'
    body.appendChild(tr)
    tr = document.createElement('td')
    tr.innerHTML = 'x<sub>Hj</sub>, мм'
    body.appendChild(tr)
    tr = document.createElement('td')
    tr.innerHTML = 'x<sub>Bj</sub>, мм'
    body.appendChild(tr)
    tr = document.createElement('td')
    tr.innerHTML = 'm<sub>j</sub>, мм'
    body.appendChild(tr)

    for (let i = 0; i < r; i++) {
        for (let j = 0; j < 3; j++) {
            tr = document.createElement('tr')
            switch (j) {
                case 0:
                    tr.innerHTML = i
                    break;
                case 1:
                    tr.innerHTML = min + (i - 1) * h
                    break;
                case 2:
                    if (i === r)
                        tr.innerHTML = max
                    else
                        tr.innerHTML = min + i * h
                    break;
                case 3:

                    break;
            }
            body.appendChild(tr)
            let td = document.createElement('td');
            body.children[j].appendChild(td)
        }


    }

    table.appendChild(body)

    return table
}

function calc() {
    $('#test').append("Решение:")
    let container = document.createElement('div')

    const min = Math.min(...values)
    const max = Math.max(...values)
    const r = Math.ceil(Math.sqrt(values.length))
    const h = (max - min) / r

    container.innerHTML = repeat + ') ' + 'Проверка гипотезы принадлежности результатов измерений к нормальному распределению' + '<br>'

    if (values.length > 50) {
        container.innerHTML += `n = ${values.length} > 50 =>  ${katex.renderToString('\\chi^2')} Пирсона <br>`
        container.innerHTML += `${++repeat}) Диапазон результатов<br>${katex.renderToString(`x_{min} = ${min}~${dimension}`)}<br>${katex.renderToString(`x_{max} = ${max}~${dimension}`)}<br>`

        container.innerHTML += `${++repeat}) Число интервалов<br>`
        container.innerHTML += `r = ${katex.renderToString(`\\sqrt{n} = \\sqrt{${values.length}} = ${r}`)} <br>`
        container.innerHTML += `j = 1...r - номер интервала <br>`

        container.innerHTML += `${++repeat}) Ширина интервала<br>`
        container.innerHTML += `${katex.renderToString(`h = \\frac{x_{max} - x_{min}}{r} = \\frac{${max} - ${min}}{${r}} = ${h}`)} <br>`

        container.innerHTML += `${++repeat}) Границы интервалов<br>`
        container.innerHTML += `${katex.renderToString(`x_{Hj} = x_{min} + (j - 1)h`)} <br>`
        container.innerHTML += `${katex.renderToString(`x_{Bj} = x_{min} + jh; x_{Br} = x_{max}`)} <br>`
        container.innerHTML += `${katex.renderToString(`j-1...r-1 [x_{Hj}; x_{Bj})`)} <br>`
        container.innerHTML += `${katex.renderToString(`j = r [x_{Hr}; x_{Br})`)} <br>`

        container.innerHTML += `${++repeat}) Частота попадания в j-й интервал, где m<sub>j</sub> - число попавших значений.<br>`
        container.append(granicaTable(r, min, max, h))
    } else
        container.innerHTML += `n = ${values.length} < 50 =>  ${katex.renderToString('\\chi^2')} Пирсона не может быть использован<br>`

    $('#test').append(container)
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
    repeat = 1
}

$('#send').bind('click', function() {
    getInputValues()

    if (decimals && q && values && dimension) {
        $('#test').empty()
        $('#defaultValues').empty()
        showValues()
        calc()
    }
});