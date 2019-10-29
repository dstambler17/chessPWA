class FormHeader extends HTMLElement {
    connectedCallback() {
        this.innerHTML = `<h6>Create Game</h6>`;
      }
  }
  
  customElements.define('form-header', FormHeader);