//объект, чтобы было удобно использовать в других файлах
export const MOCK_API = {
  categories: "https://api.jsonbin.io/v3/b/692dcfe6ae596e708f7cb637",
  cities: "https://api.jsonbin.io/v3/b/692dd00343b1c97be9d0f6af",
  likes: "https://api.jsonbin.io/v3/b/692dd01f43b1c97be9d0f6dc",
  skills: "https://api.jsonbin.io/v3/b/692dd04343b1c97be9d0f721",
  subcategories: "https://api.jsonbin.io/v3/b/692dd05bae596e708f7cb6fc",
  users: "https://api.jsonbin.io/v3/b/692dd074ae596e708f7cb721",
};

//функция загрузки данных, <T> - данные, которые получим
export async function fetchMock<T>(url: string): Promise<T> {
  const res = await fetch(url);

  //превращаем ответ сервера в json файлы
  const data = await res.json();

  //JSONBin ВСЕГДА кладёт реальный объект внутрь поля record - поэтому возвращаем именно data.record
  return data.record;
}

export const api = {
  //вызываем fetchMock с сылкой - возвращаем массив
  getCategories: () => fetchMock(MOCK_API.categories),
  getCities: () => fetchMock(MOCK_API.cities),
  getLikes: () => fetchMock(MOCK_API.likes),
  getSkills: () => fetchMock(MOCK_API.skills),
  getSubcategories: () => fetchMock(MOCK_API.subcategories),
  getUsers: () => fetchMock(MOCK_API.users),
};

//пример использования
// import { api } from "@/shared/api/mockApi";

// api.getUsers().then(users => {
//   console.log(users);
// });
