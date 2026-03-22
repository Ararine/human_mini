import { api, api_cre } from "./axios";
import qs from "qs";

export async function getPark(keyword, coordinate) {
  const res = await api_cre.get("/park", {
    params: { keyword: keyword, coordinate: coordinate },
    // paramsSerializer : axios 에서 query param을 url로 변환하는 방식을 커스터마이징하는 옵션
    // 여러 옵션들이 있으니 확인 필요
    // arrayFormat 의 옵션 값으로는 brackets(기본값), repeat, indices, comma
    // ex) [37.5665, 126.978] 전달한다고 가정
    // brackets : coordinate[]=37.56&coordinate[]=126.97
    // repeat : coordinate=37.56&coordinate=126.97
    // indices : coordinate[]=37.56&coordinate[]=126.97
    // comma : coordinate=37.56,126.97
    paramsSerializer: (params) =>
      // qs : Object(객체) -> URL query string 변환해주는 라이브러리
      qs.stringify(params, { arrayFormat: "repeat" }),
  });
  return res;
}
