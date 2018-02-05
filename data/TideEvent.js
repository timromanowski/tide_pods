class TideEvent{
  constructor( date, time, height, type ){
    this._date = date;
    this._time = time;
    this._height = height;
    this._type = type;
  }
}

module.exports = TideEvent;