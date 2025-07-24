
export function getClientes() {
  return fetch("http://localhost:8080/clientes/ListarTodos")
    .then((response) => response.json())
    .catch((error) => {
      console.error("Erro ao buscar clientes:", error);
      throw error;
    });
}
