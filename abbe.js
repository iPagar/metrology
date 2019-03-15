let decimals = null;
let dimension = null;
let repeat = null;
let values = null;
let q = null;
const decimalsAdd = 2;

function barX() {
	let sum = 0;

	values.forEach(value => (sum += value));

	const barX = sum / values.length;

	return barX.toPrecision(decimals);
}

function sX2() {
	let sum = 0;

	values.forEach(value => (sum += Math.pow(value - barX(), 2)));

	const sX2 = sum / (values.length - 1);

	return sX2.toPrecision(decimals);
}

function qX2() {
	let sum = 0;

	for (let i = 0; i < values.length - 1; i++)
		sum += Math.pow(values[i + 1] - values[i], 2);

	const qX2 = sum / (2 * (values.length - 1));

	return qX2.toPrecision(decimals);
}

function U() {
	const U = qX2() / sX2();

	return U.toPrecision(decimals);
}

function Uq() {
	if (!Uq.Uq)
		Uq.Uq = prompt(
			"Введите критерий Аббе при n = " +
				values.length +
				", q = " +
				q +
				" => "
		);

	return Uq.Uq;
}

function calc() {
	let container = document.createElement("div");
	container.innerHTML =
		repeat +
		") " +
		"Оценка дисперсии результатов с помощью отклонения от среднего" +
		"<br>";
	container.innerHTML +=
		katex.renderToString(
			"\\bar{x} = \\frac{1}{n} \\sum_{i=1}^{n}=" + barX()
		) +
		"(" +
		dimension +
		")" +
		"<br>";
	container.innerHTML +=
		katex.renderToString(
			"S_{x}^2 = \\frac{1}{n-1}\\sum_{i=1}^{n} (x_i - \\bar{x})^2=" +
				sX2()
		) +
		"(" +
		dimension +
		katex.renderToString("^2)") +
		"<br>";

	container.innerHTML +=
		++repeat +
		") " +
		"Оценка дисперсии результатов с помощью последовательных разностей" +
		"<br>";
	container.innerHTML +=
		katex.renderToString(
			"Q_{x}^2 = \\frac{1}{2(n-1)}\\sum_{i=1}^{n-1} (x_{i+1} - x_{i})^2 =" +
				qX2()
		) +
		"(" +
		dimension +
		katex.renderToString("^2)") +
		"<br>";

	container.innerHTML +=
		++repeat + ") " + "Найдем наблюдаемое значение критерия Аббе" + "<br>";
	container.innerHTML +=
		katex.renderToString("U = \\frac{Q_x^2}{S_x^2}=" + U()) + "<br>";

	container.innerHTML +=
		++repeat + ") " + "Критическое значение критерия Аббе" + "<br>";
	container.innerHTML +=
		katex.renderToString(
			"n = " + values.length + ", q = " + q + "=> U_q = " + Uq()
		) + "<br>";

	container.innerHTML += ++repeat + ") " + "Проверка гипотезы" + "<br>";
	if (U() > Uq()) {
		container.innerHTML +=
			katex.renderToString("U > U_q => ") +
			"Нет оснований отвергнуть нулевую гипотезу" +
			"<br>";
	} else {
		container.innerHTML +=
			katex.renderToString("U \\le U_q => ") +
			"есть основания отвергнуть нулевую гипотезу" +
			"<br>";
	}

	$("#test").append(container);
}

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
	values = values.map(value => Number(value));
	q = Number($("#q").val());
	repeat = 1;
}

$("#send").bind("click", function() {
	getInputValues();
	showValues();
	$("#test").empty();
	$("#defaultValues").empty();
	$("#test").append("Решение:");
	calc();
});
