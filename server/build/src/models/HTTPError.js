"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class HTTPError {
    constructor() { }
    static NotImplements(Base) {
        return `
    <h1>Body of Request not implements ${Base.name}</h1>
    <table>
    <tr>
      <th>Key</th>
      <th>Requirement</th>
    </tr>
    ${Object.entries(new Base()).map(([key, value]) => `
      <td>${key}</td>
      <td>${value}</td>
      `)}
    </table>
  `;
    }
}
exports.default = HTTPError;
