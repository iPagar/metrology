let decimals;
let q;
let values;
let decimalsAdd = 2;
let dimension;
let repeat;
let crit = 5;
let firstTable = [];
let tempAr;
let ra;
let lastArray = [];

function createTableValues() {
	let table = document.createElement("table");
	table.className = "table table-sm";
	let body = document.createElement("tbody");
	let tr = document.createElement("tr");
	tr.innerHTML = "x<sub>i</sub>(" + dimension + ") = ";
	body.appendChild(tr);
	for (let i = 0; i < values.length; i++) {
		if (i % 10 == 0) {
			let tr = document.createElement("tr");
			body.appendChild(tr);
		}
		let td = document.createElement("td");
		td.innerHTML = values[i].toFixed(decimals - decimalsAdd);
		body.children[body.children.length - 1].appendChild(td);
	}
	table.appendChild(body);
	return table;
}

function granicaTable(r, min, max, h) {
	let table = document.createElement("table");
	table.className = "table table-sm";
	let body = document.createElement("tbody");

	td = document.createElement("tr");
	body.appendChild(td);
	let tr = document.createElement("td");
	tr.innerHTML = "j";
	td.appendChild(tr);
	tr = document.createElement("td");
	tr.innerHTML = "x<sub>Hj</sub>, мм";
	td.appendChild(tr);
	tr = document.createElement("td");
	tr.innerHTML = "x<sub>Bj</sub>, мм";
	td.appendChild(tr);
	tr = document.createElement("td");
	tr.innerHTML = "m<sub>j</sub>, мм";
	td.appendChild(tr);

	const arr = [];

	for (let i = 1; i <= r; i++) {
		tr = document.createElement("tr");
		body.appendChild(tr);
		let temp = [];

		for (let j = 0; j < 4; j++) {
			td = document.createElement("td");

			switch (j) {
				case 0:
					td.innerHTML = i;
					break;
				case 1:
					td.innerHTML = (min + (i - 1) * h).toFixed(decimals);
					temp.push(td.innerHTML);
					break;
				case 2:
					if (i === r) td.innerHTML = max.toFixed(decimals);
					else td.innerHTML = (min + i * h).toFixed(decimals);
					temp.push(td.innerHTML);
					break;
				case 3:
					if (i !== r)
						td.innerHTML = values.filter(
							(value) =>
								value >= min + (i - 1) * h &&
								value < min + i * h
						).length;
					else td.innerHTML = 1;
					temp.push(td.innerHTML);
					break;
			}

			tr.appendChild(td);
		}
		arr.push(temp);
	}

	unionIntervals(arr);

	table.appendChild(body);
	tempAr = arr;

	return table;
}

function unionTable(arr) {
	let table = document.createElement("table");
	table.className = "table table-sm";
	let body = document.createElement("tbody");

	td = document.createElement("tr");
	body.appendChild(td);
	let tr = document.createElement("td");
	tr.innerHTML = "j";
	td.appendChild(tr);
	tr = document.createElement("td");
	tr.innerHTML = "x<sub>Hj</sub>, мм";
	td.appendChild(tr);
	tr = document.createElement("td");
	tr.innerHTML = "x<sub>Bj</sub>, мм";
	td.appendChild(tr);
	tr = document.createElement("td");
	tr.innerHTML = "m<sub>j</sub>, мм";
	td.appendChild(tr);

	for (let i = 0; i < arr.length; i++) {
		tr = document.createElement("tr");
		body.appendChild(tr);

		for (let j = 0; j < 4; j++) {
			td = document.createElement("td");

			switch (j) {
				case 0:
					td.innerHTML = i + 1;
					break;
				default:
					td.innerHTML = arr[i][j - 1];
					break;
			}

			tr.appendChild(td);
		}
	}
	table.appendChild(body);

	let text = document.createElement("div");
	text.innerHTML = `Объединяем интервалы`;
	$("#test").append(text);
	$("#test").append(table);

	thirdTable(arr);
}

function lastTable() {
	let table = document.createElement("table");
	table.className = "table table-sm";
	let body = document.createElement("tbody");

	td = document.createElement("tr");
	body.appendChild(td);
	let tr = document.createElement("td");
	tr.innerHTML = "j";
	td.appendChild(tr);
	tr = document.createElement("td");
	tr.innerHTML = "z<sub>j</sub>";
	td.appendChild(tr);
	tr = document.createElement("td");
	tr.innerHTML = "f<sub>z</sub>(z<sub>j</sub>)";
	td.appendChild(tr);
	tr = document.createElement("td");
	tr.innerHTML = "в<sub>j</sub>";
	td.appendChild(tr);

	arr = calcLastTable(calcThirdTable(tempAr));

	for (let i = 0; i < arr.length; i++) {
		tr = document.createElement("tr");
		body.appendChild(tr);

		for (let j = 0; j < 4; j++) {
			td = document.createElement("td");

			switch (j) {
				case 0:
					td.innerHTML = i + 1;
					break;
				default:
					td.innerHTML = arr[i][j - 1];
					break;
			}

			tr.appendChild(td);
		}
	}
	table.appendChild(body);
	$("#test").append(table);
}

function calcLastTable(arr) {
	const array = [];
	const n = values.length;

	for (let i = 0; i < arr.length; i++) {
		let temp = [];

		temp.push(((arr[i][1] - avg(values)) / sd(values)).toFixed(decimals));
		temp.push(
			(
				(1 / Math.sqrt(2 * Math.PI)) *
				Math.exp(-(Math.pow(temp[0], 2) / 2))
			).toFixed(decimals)
		);
		temp.push(
			((Number(arr[i][0]) * temp[1]) / sd(values)).toFixed(decimals)
		);

		array.push(temp);
		lastArray.push(temp);
	}

	return array;
}

function avg(x) {
	let total = 0;
	for (let i = 0; i < x.length; i++) {
		total += x[i];
	}
	let avg = total / x.length;
	return avg.toFixed(decimals);
}

function sd(x) {
	let total = 0;
	for (let i = 0; i < x.length; i++) {
		total += Math.pow(x[i] - avg(x), 2);
	}
	const sd = Math.sqrt(total / (x.length - 1));
	return sd.toFixed(decimals);
}

function thirdTable(array) {
	let table = document.createElement("table");
	table.className = "table table-sm";
	let body = document.createElement("tbody");

	td = document.createElement("tr");
	body.appendChild(td);
	let tr = document.createElement("td");
	tr.innerHTML = "j";
	td.appendChild(tr);
	tr = document.createElement("td");
	tr.innerHTML = "h<sub>j</sub>, мм";
	td.appendChild(tr);
	tr = document.createElement("td");
	tr.innerHTML = "x<sub>0j</sub>, мм";
	td.appendChild(tr);
	tr = document.createElement("td");
	tr.innerHTML = "p^<sub>j</sub>";
	td.appendChild(tr);
	tr = document.createElement("td");
	tr.innerHTML = "p*<sub>j</sub>, 1/мм";
	td.appendChild(tr);

	arr = calcThirdTable(array);

	for (let i = 0; i < arr.length; i++) {
		tr = document.createElement("tr");
		body.appendChild(tr);

		for (let j = 0; j < 5; j++) {
			td = document.createElement("td");

			switch (j) {
				case 0:
					td.innerHTML = i + 1;
					break;
				default:
					td.innerHTML = arr[i][j - 1];
					break;
			}

			tr.appendChild(td);
		}
	}
	table.appendChild(body);
	$("#test").append(`<div>Таблица для построения диаграммы</div>`);
	$("#test").append(table);
}

function calcThirdTable(arr) {
	const array = [];
	const n = values.length;

	for (let i = 0; i < arr.length; i++) {
		let temp = [];

		temp.push((arr[i][1] - arr[i][0]).toFixed(decimals));
		temp.push(
			((Number(arr[i][1]) + Number(arr[i][0])) / 2).toFixed(decimals)
		);
		temp.push((Number(arr[i][2]) / n).toFixed(decimals));
		temp.push((temp[2] / temp[0]).toFixed(decimals));

		array.push(temp);
	}

	return array;
}

function unionIntervals(arr) {
	let flag = 0;

	for (let i = 0; i < arr.length; i++) {
		if (i < arr.length - 1) {
			if (arr[i][2] < crit) {
				arr[i + 1][0] = arr[i][0];
				arr[i + 1][2] = Number(arr[i][2]) + Number(arr[i + 1][2]);
				arr.splice(i, 1);
				flag = 1;
				break;
			}
		} else {
			if (arr[i][2] < crit) {
				arr[i - 1][1] = arr[i][1];
				arr[i - 1][2] = Number(arr[i][2]) + Number(arr[i - 1][2]);
				arr.splice(i, 1);
				flag = 1;
				break;
			}
		}
	}

	if (flag) unionIntervals(arr);
	else firstTable = arr;
}

function last() {
	let ary = 0;
	let n = values.length;
	for (let i = 0; i < firstTable.length; i++) {
		ary +=
			Math.pow(firstTable[i][2] - n * lastArray[i][2], 2) /
			(n * lastArray[i][2]);
	}

	$("#test").append(`<div>x2 = ${ary.toFixed(decimals)}</div>`);
	let crit = prompt(
		`введите х2крит q = ${q}, v = r - 1 - 2 = ${firstTable.length - 1 - 2}`
	);
	$("#test").append(`<div>критическое значение x2 = ${crit}</div>`);
	$("#test").append(
		`<div>${
			ary < crit
				? "x2 < x2крит => нормальное распределение"
				: "x2 => x2крит => нормальное распределение не подтверждается"
		}</div>`
	);
}

function calc() {
	$("#test").append("Решение:");
	let container = document.createElement("div");

	const min = Math.min(...values);
	const max = Math.max(...values);
	const r = Math.ceil(Math.sqrt(values.length));
	const h = (max - min) / r;
	ra = r;
	container.innerHTML =
		repeat +
		") " +
		"Проверка гипотезы принадлежности результатов измерений к нормальному распределению" +
		"<br>";

	if (values.length >= 50) {
		container.innerHTML += `n = ${
			values.length
		} > 50 =>  ${katex.renderToString("\\chi^2")} Пирсона <br>`;
		container.innerHTML += `${++repeat}) Диапазон результатов<br>${katex.renderToString(
			`x_{min} = ${min}~${dimension}`
		)}<br>${katex.renderToString(`x_{max} = ${max}~${dimension}`)}<br>`;

		container.innerHTML += `${++repeat}) Число интервалов<br>`;
		container.innerHTML += `r = ${katex.renderToString(
			`\\sqrt{n} = \\sqrt{${values.length}} = ${r}`
		)} <br>`;

		container.innerHTML += `${++repeat}) Ширина интервала<br>`;
		container.innerHTML += `${katex.renderToString(
			`h = \\frac{x_{max} - x_{min}}{r} = \\frac{${max} - ${min}}{${r}} = ${h.toFixed(
				decimals
			)}~${dimension}`
		)} <br>`;

		container.innerHTML += `${++repeat}) Частота попадания в j-й интервал, где m<sub>j</sub> - число попавших значений.<br>`;
		container.append(granicaTable(r, min, max, h));
		$("#test").append(container);
		unionTable(tempAr);
		lastTable();
		last();
	} else {
		container.innerHTML += `n = ${
			values.length
		} < 50 =>  ${katex.renderToString(
			"\\chi^2"
		)} Критерий Пирсона не может быть использован<br>`;
		$("#test").append(container);
	}
}

function showValues() {
	let table = createTableValues();
	let container = document.createElement("div");
	container.append("Дано:");
	container.append(document.createElement("br"));
	container.append(table);
	container.append("q = " + q);
	$("#defaultValues").append(container);
}

function getInputValues() {
	values = $("#inputValues")
		.val()
		.replace(/,/g, ".")
		.match(/[+-]?([0-9]*[.])?[0-9]+/g);
	decimals =
		Math.max(...values)
			.toString()
			.split(".")
			.pop().length + decimalsAdd;
	dimension = $("#dimension").val();
	values = values.map((value) => Number(value));
	q = Number($("#q").val());
	repeat = 1;
}

$("#send").bind("click", function() {
	getInputValues();

	if (decimals && q && values && dimension) {
		$("#test").empty();
		$("#defaultValues").empty();
		showValues();
		calc();
	}
});
