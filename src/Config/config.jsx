
class Helpers {
  
    static localhost = "127.0.0.1:8000";
    static server = "docsphere.cyberifyportfolio.com";

    static basePath = `//${this.localhost}`;

    static apiUrl = `${this.basePath}/api/v1/`;

    static googleUrl = `${this.basePath}/`;
  
    static authUser = JSON.parse(localStorage.getItem("user")) ?? {};
    static serverImage = (name) => {
      return `${this.basePath}/uploads/${name}`;
    };
    
    static authHeaders = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    };
  
    static authFileHeaders = {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    }
}