$(document).ready(function () {
  var employees = [];
  var currentPage = 1;
  var employeesPerPage = 15;

  function getEmployees(action, filtro, valor, operador) {
    var url =
      "http://api.willcode.tech/funcionarios/?ACAO=" +
      action +
      "&FILTRO=" +
      filtro +
      "&VALOR=" +
      valor +
      "&OPERADOR=" +
      operador +
      "&USUARIO=USUARIO&SENHA=SENHA_SECRETA";
    $.get(url)
      .done(function (data) {
        if (data && Array.isArray(data)) {
          employees = data;
          loadEmployees(currentPage);
        } else {
          alert("Erro ao obter dados dos funcionários");
        }
      })
      .fail(function () {
        alert("Erro na requisição à API");
      });
  }

  var action = "LISTAR-TODOS";
  getEmployees(action);

  $("#searchForm").submit(function (event) {
    event.preventDefault();
    var action = "LISTAR-FILTROS";
    var filtro = $("#filtro").val();
    var valor = $("#valor").val().trim();
    var operador = $("#operador").val();
    currentPage = 1;
    getEmployees(action, filtro, valor, operador);
  });

  $("#resetBtn").click(function (event) {
    event.preventDefault();
    var action = "LISTAR-TODOS";
    var filtro = "";
    var valor = $("#valor").val("");
    var operador = "";
    getEmployees(action, filtro, valor, operador);
  });

  function loadEmployees(page) {
    var startIndex = (page - 1) * employeesPerPage;
    var endIndex = startIndex + employeesPerPage;
    var paginatedEmployees = employees.slice(startIndex, endIndex);

    var tbody = $("#employeesTable tbody");
    tbody.empty();

    for (var i = 0; i < paginatedEmployees.length; i++) {
      var employee = paginatedEmployees[i];
      var row = $("<tr>");
      row.append($("<td>").text(employee.id));
      row.append($("<td>").text(employee.NomeCompleto));
      row.append($("<td>").text(formatDate(employee.DataNascimento)));
      row.append($("<td>").text(formatSalary(employee.Salario)));
      tbody.append(row);
    }

    updatePagination();
  }

  function updatePagination() {
    var totalPages = Math.ceil(employees.length / employeesPerPage);

    var pagination = $(".pagination");
    pagination.empty();

    for (var i = 1; i <= totalPages; i++) {
      var pageItem = $(
        "<li class='page-item'><a class='page-link' href='#'>" + i + "</a></li>"
      );
      pagination.append(pageItem);
    }

    $(".page-item").on("click", function (event) {
      event.preventDefault();
      var targetPage = parseInt($(this).text());
      if (!isNaN(targetPage)) {
        currentPage = targetPage;
        loadEmployees(currentPage);
        updatePagination();
      }
    });
  }

  function formatDate(date) {
    var year = date.substring(0, 4);
    var month = date.substring(4, 6);
    var day = date.substring(6, 8);
    return day + "/" + month + "/" + year;
  }

  function formatSalary(salary) {
    return (
      "R$ " +
      Number(salary).toLocaleString("pt-BR", {
        currency: "BRL",
      })
    );
  }
});
