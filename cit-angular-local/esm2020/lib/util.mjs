export function rand() {
  return ((1 + Math.random()) * 0x10000) | 0;
}
export function optHash(options) {
  return JSON.stringify(options);
}
export class EventDiff {
  constructor() {
    this.orig = { 'hashes': {} };
  }
  diff(list) {
    const orig = this.orig;
    let result = {};
    // new hashes, new ids
    let hashes = {};
    list = list || [];
    for (let i = 0; i < list.length; i++) {
      let e = list[i];
      let id = e.id;
      if (!id) {
        throw "The 'id' property must be specified for event data object";
      }
      if (hashes.hasOwnProperty('' + id)) {
        throw 'Duplicate event IDs are not allowed, id: ' + id;
      }
      hashes['' + id] = JSON.stringify(e);
    }
    // array of new objects
    result.add = list.filter(function (item) {
      return !orig.hashes.hasOwnProperty(item.id);
    });
    // array of IDs
    result.remove = Object.getOwnPropertyNames(orig.hashes)
      .filter(function (id) {
        return !hashes.hasOwnProperty(id);
      })
      .map(function (id) {
        return JSON.parse(orig.hashes[id]).id;
      }); // array of ids
    // array of new objects
    result.modify = list.filter(function (item) {
      return orig.hashes.hasOwnProperty(item.id) && orig.hashes[item.id] !== hashes[item.id];
    });
    result.changeCount = result.add.length + result.modify.length + result.remove.length;
    orig.hashes = hashes;
    return result;
  }
}
