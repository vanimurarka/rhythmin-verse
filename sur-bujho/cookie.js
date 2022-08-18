export class cookie {
  #id = "";
  constructor (id)
  { this.#id = id; }
  set(cname, cvalue, exdays)
  {
    const d = new Date();
    d.setTime(d.getTime() + (exdays*24*60*60*1000));
    let expires = "expires="+ d.toUTCString();
    let id = this.#id + cname;
    document.cookie = id + "=" + cvalue + ";" + expires + ";";
  }
  get (cname)
  {
    let name = this.#id + cname + "=";
    let decodedCookie = decodeURIComponent(document.cookie);
    let ca = decodedCookie.split(';');
    for(let i = 0; i <ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) == ' ') {
        c = c.substring(1);
      }
      if (c.indexOf(name) == 0) {
        return c.substring(name.length, c.length);
      }
    }
    return "";
  }
}