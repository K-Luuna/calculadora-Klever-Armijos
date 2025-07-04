class CalculadoraBasica extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });

    // estilos Bootstrap cargados desde la carpeta css de nuestro proyecto
    this.shadowRoot.innerHTML = `
      <link rel="stylesheet" href="/public/css/bootstrap.min.css">
      <div class="card mx-auto" style="max-width: 400px;">
        <div class="card-body">
          <h5 class="card-title">Operaciones básicas</h5>
          
          <div class="mb-3">
            <input type="number" id="num1" class="form-control" placeholder="Primer número">
          </div>
          <div class="mb-3">
            <input type="number" id="num2" class="form-control" placeholder="Segundo número">
          </div>
          <div class="mb-3">
            <select id="operacion" class="form-select">
              <option value="sumar">Sumar</option>
              <option value="restar">Restar</option>
              <option value="multiplicar">Multiplicar</option>
              <option value="dividir">Dividir</option>
            </select>
          </div>
          <button id="calcular" class="btn btn-primary w-100">Calcular</button>

          <div id="resultado" class="mt-3 alert alert-info d-none"></div>
          <div id="error" class="mt-2 alert alert-danger d-none"></div>

          <hr>
          <h6>Historial</h6>
          <ul id="historial" class="list-group small"></ul>
        </div>
      </div>
    `;
  }

  connectedCallback() {
    this.shadowRoot.getElementById('calcular').addEventListener('click', () => this.realizarCalculo());
  }

  realizarCalculo() {
    const num1 = parseFloat(this.shadowRoot.getElementById('num1').value);
    const num2 = parseFloat(this.shadowRoot.getElementById('num2').value);
    const operacion = this.shadowRoot.getElementById('operacion').value;
    const resultadoDiv = this.shadowRoot.getElementById('resultado');
    const errorDiv = this.shadowRoot.getElementById('error');
    const historial = this.shadowRoot.getElementById('historial');

    resultadoDiv.classList.add('d-none');
    errorDiv.classList.add('d-none');

    if (isNaN(num1) || isNaN(num2)) {
      errorDiv.textContent = 'Por favor, ingresa números válidos.';
      errorDiv.classList.remove('d-none');
      return;
    }

    let resultado;
    let expresion;

    switch (operacion) {
      case 'sumar':
        resultado = num1 + num2;
        expresion = `${num1} + ${num2} = ${resultado}`;
        break;
      case 'restar':
        resultado = num1 - num2;
        expresion = `${num1} - ${num2} = ${resultado}`;
        break;
      case 'multiplicar':
        resultado = num1 * num2;
        expresion = `${num1} × ${num2} = ${resultado}`;
        break;
      case 'dividir':
        if (num2 === 0) {
          errorDiv.textContent = 'Error: División por cero.';
          errorDiv.classList.remove('d-none');
          return;
        }
        resultado = num1 / num2;
        expresion = `${num1} ÷ ${num2} = ${resultado}`;
        break;
      default:
        errorDiv.textContent = 'Operación no válida.';
        errorDiv.classList.remove('d-none');
        return;
    }

    resultadoDiv.textContent = `Resultado: ${resultado}`;
    resultadoDiv.classList.remove('d-none');

    // Agregar al historial
    const li = document.createElement('li');
    li.textContent = expresion;
    li.classList.add('list-group-item');
    historial.prepend(li);

    // Emitir evento personalizado
    this.dispatchEvent(new CustomEvent('resultado-calculado', {
      detail: {
        operacion,
        resultado,
        expresion
      },
      bubbles: true,
      composed: true
    }));
  }
}

customElements.define('calculadora-basica', CalculadoraBasica);
