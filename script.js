Power = new Mongo.Collection("power");
Ships = new Mongo.Collection("ships");
Ship = new Mongo.Collection("ship");
Engineering = new Mongo.Collection("engineering");
Stations = new Mongo.Collection("stations");
Misc = new Mongo.Collection("misc");
Scanning = new Mongo.Collection("scanning");

Router.map(function() {
  this.configure({
    notFoundTemplate: 'notFound'
  });
  this.route('/', function() {
    this.render('home');
  });
  this.route('/soleus', function() {
    this.render('soleusHome');
  });
  this.route('/soleus/fl/:_id', function () {
    var params = this.params;
    var id = params._id;
    if (id == Misc.findOne({name: 'pwd'}).value) {
      this.render('soleusFlightDirector');
    } else {
      this.render('soleusHome');
    };
  });
  this.route('/soleus/flightdirector', function() {
    this.render('soleusFlightDirectorLogin');
  });
  this.route('/soleus/mainviewscreen', function() {
    Session.set("station", "Main Viewscreen");
    this.render('mainViewscreen');
  });
  this.route('/soleus/:_station/:_id', function() {
    var params = this.params;
    var station = params._station;
    var id = params._id;
    this.render('layout');
    this.render('header', {to: 'header'});
    this.render('hello', {to: 'content'});
    if (station == "engineering") {
      this.render('engineeringSide', {to: 'sidebar'});
      if (id == "damage") {
        this.render('damage', {to: 'content'});
      };
      if (id == "coolant") {
        this.render('coolant', {to: 'content'});
      };
      if (id == "power") {
        this.render('power', {to: 'content'});
      };
    };
    if (station == "navigations") {
      this.render('navigationsSide', {to: 'sidebar'});
      if (id == "course") {
        this.render('course', {to: 'content'});
      };
      if (id == "speed") {
        this.render('speed', {to: 'content'});
      };
      if (id == "manualcontrol") {
        this.render('manualControl', {to: 'content'});
      };
    };
    if (station == "sensors") {
      this.render('sensorsSide', {to: 'sidebar'});
      if (id == "scanning") {
        this.render('scanning', {to: 'content'});
      };
      if (id == "inbox") {
        this.render('inbox', {to: 'content'});
      };
      if (id == "sendmessage") {
        this.render('sendMessage', {to: 'content'});
      };
    };
    if (station == "primeofficer") {
      this.render('primeOfficerSide', {to: 'sidebar'});
      if (id == "missiondata") {
        this.render('missionData', {to: 'content'});
      };
      if (id == "hqmessage") {
        this.render('HQMessage', {to: 'content'});
      };
      if (id == "ship") {
        this.render('ship', {to: 'content'});
      };
    };
    if (station == "tactical") {
      this.render('tacticalSide', {to: 'sidebar'});
      if (id == "locking") {
        this.render('locking', {to: 'content'});
      };
      if (id == "weapons") {
        this.render('weapons', {to: 'content'});
      };
      if (id == "shielding") {
        this.render('shielding', {to: 'content'});
      };
    };
  });
});

if (Meteor.isClient) {
  // counter starts at 0
  Session.setDefault("name", "");
  Session.setDefault("station", "none");
  Session.setDefault("meSpeak", false);

  ready = function() {
    meSpeak.loadConfig("/mespeak_config.json");
    meSpeak.loadVoice("/voices/en/en-us.json");
    $(document).bind('contextmenu', function(e){
      return false;
    }); 
    if (Session.get("station") == "Main Viewscreen") {
      resetCollectionMisc();
      meSpeakLoop();
    };
    if (Session.get("station") == "Engineering") {
        warp = Power.findOne({name: "Warp"}).powerUse / 2;
        phasers = Power.findOne({name: "Phasers"}).powerUse;
        torpedoes = Power.findOne({name: "Torpedoes"}).powerUse * 2;
        shields = Power.findOne({name: "Shields"}).powerUse / 1.5;
        computers = Power.findOne({name: "Computers"}).powerUse;
        systems = Power.findOne({name: "Systems"}).powerUse;
        communications = Power.findOne({name: "Communications"}).powerUse * 2;
        sensors = Power.findOne({name: "Sensors"}).powerUse * 2;
        mainComputer = Power.findOne({name: "Main Computer"}).powerUse;
        warpCool = Power.findOne({name: "Warp"}).temperature;
        phasersCool = Power.findOne({name: "Phasers"}).temperature;
        torpedoesCool = Power.findOne({name: "Torpedoes"}).temperature;
        shieldsCool = Power.findOne({name: "Shields"}).temperature;
        computersCool = Power.findOne({name: "Computers"}).temperature;
        systemsCool = Power.findOne({name: "Systems"}).temperature;
        communicationsCool = Power.findOne({name: "Communications"}).temperature;
        sensorsCool = Power.findOne({name: "Sensors"}).temperature;
        mainComputerCool = Power.findOne({name: "Main Computer"}).temperature;
        progressBar(warpCool,$('#coolWarp'),500);
        progressBar(phasersCool,$('#coolPhasers'),500);
        progressBar(torpedoesCool,$('#coolTorpedoes'),500);
        progressBar(shieldsCool,$('#coolShields'),500);
        progressBar(computersCool,$('#coolComputers'),500);
        progressBar(systemsCool,$('#coolSystems'),500);
        progressBar(communicationsCool,$('#coolCommunications'),500);
        progressBar(sensorsCool,$('#coolSensors'),500);
        progressBar(mainComputerCool,$('.coolMainComputer'),500);
        $('#warpBar').slider({
          value: warp,
          stop: function(event, ui) {
            val = ui.value;
            updateBar('Warp', val * 2);
            id = Power.findOne({name: 'Warp'})._id;
            if (val == 100) {
              Power.update(id, {$set: {enabled: true}});
            } else {
              Power.update(id, {$set: {enabled: false}});
            };
          }
        });
        $('#phasersBar').slider({
          value: phasers,
          stop: function(event, ui) {
            val = ui.value;
            updateBar('Phasers', val);
            id = Power.findOne({name: 'Phasers'})._id;
            if (val == 100) {
              Power.update(id, {$set: {enabled: true}});
            } else {
              Power.update(id, {$set: {enabled: false}});
            };
          }
        });
        $('#torpedoesBar').slider({
          value: torpedoes,
          stop: function(event, ui) {
            val = ui.value;
            updateBar('Torpedoes', val / 2);
            id = Power.findOne({name: 'Torpedoes'})._id;
            if (val == 100) {
              Power.update(id, {$set: {enabled: true}});
            } else {
              Power.update(id, {$set: {enabled: false}});
            };
          }
        });
        $('#shieldsBar').slider({
          value: shields,
          stop: function(event, ui) {
            val = ui.value;
            updateBar('Shields', val * 1.5);
            id = Power.findOne({name: 'Shields'})._id;
            if (val == 100) {
              Power.update(id, {$set: {enabled: true}});
            } else {
              Power.update(id, {$set: {enabled: false}});
            };
          }
        });
        $('#computersBar').slider({
          value: computers,
          stop: function(event, ui) {
            val = ui.value;
            updateBar('Computers', val);
            id = Power.findOne({name: 'Computers'})._id;
            if (val == 100) {
              Power.update(id, {$set: {enabled: true}});
            } else {
              Power.update(id, {$set: {enabled: false}});
            };
          }
        });
        $('#systemsBar').slider({
          value: systems,
          stop: function(event, ui) {
            val = ui.value;
            updateBar('Systems', val);
            id = Power.findOne({name: 'Systems'})._id;
            if (val == 100) {
              Power.update(id, {$set: {enabled: true}});
            } else {
              Power.update(id, {$set: {enabled: false}});
            };
          }
        });
        $('#communicationsBar').slider({
          value: communications,
          stop: function(event, ui) {
            val = ui.value;
            updateBar('Communications', val / 2);
            id = Power.findOne({name: 'Communications'})._id;
            if (val == 100) {
              Power.update(id, {$set: {enabled: true}});
            } else {
              Power.update(id, {$set: {enabled: false}});
            };
          }
        });
        $('#sensorsBar').slider({
          value: sensors,
          stop: function(event, ui) {
            val = ui.value;
            updateBar('Sensors', val / 2);
            id = Power.findOne({name: 'Sensors'})._id;
            if (val == 100) {
              Power.update(id, {$set: {enabled: true}});
            } else {
              Power.update(id, {$set: {enabled: false}});
            };
          }
        });
        $('#mainComputerBar').slider({
          value: mainComputer,
          stop: function(event, ui) {
            val = ui.value;
            updateBar('Main Computer', val);
            id = Power.findOne({name: 'Main Computer'})._id;
            if (val == 100) {
              Power.update(id, {$set: {enabled: true}});
            } else {
              Power.update(id, {$set: {enabled: false}});
            };
          }
        });
    };
    if (Session.get("station") == "Tactical") {
      progressBar(Ship.findOne({name: "Phasers1"}).value, $('#phasers1Bar'), 750);
      progressBar(Ship.findOne({name: "Phasers2"}).value, $('#phasers2Bar'), 750);
    }
    console.log("Ready!");
  };

  $(window).load(function() {
    setTimeout(function() {
      ready();
    }, 3000);
  });

  setInput = function() {
    Session.set("name", document.getElementById('name').value);
    return document.getElementById('name').value;
  };

  insertShip = function(name,shields,phasers,engines,torpedoes) {
    Ships.insert({
      name: name,
      shields: shields,
      phasers: phasers,
      torpedoes: torpedoes,
      engines: engines
    });
  };

  setMessage = function(str) {
    obj = Misc.findOne({name: str});
    if (str == "ClientToHQ") {
      val = document.getElementById('hqMessagingBoxClient').value;
    } else {
      val = document.getElementById('hqMessagingBoxDirector').value
    }
    Misc.update(obj._id, {$set: {value: val}});
  };

  insertStation = function(station) {
    Session.set("id",Stations.insert({station: station, name: Session.get("name")}));
  };

  removeStation = function(obj) {
    if (typeof Stations.findOne(obj) != "undefined") {
      Stations.remove(Stations.findOne(obj)._id);
    };
  };

  resetCollectionStations = function() {
    aa = Stations.find().fetch();
    for(ii = 0; ii < aa.length; ii++) {
      Stations.remove(aa[ii]._id);
    };
  };

  resetCollectionShips = function() {
    aa = Ships.find().fetch();
    for(ii = 0; ii < aa.length; ii++) {
      Ships.remove(aa[ii]._id);
    };
  };

  resetCollectionMisc = function() {
    aa = Misc.find().fetch();
    for(ii = 0; ii < aa.length; ii++) {
      if (aa[ii].name != 'pwd') {
        Misc.remove(aa[ii]._id);
      }
    };
    Misc.insert({name: "meSpeak"});
    Misc.insert({name: "HQToClient", value: ""});
    Misc.insert({name: "ClientToHQ", value: ""});
    if (typeof Misc.findOne({name: 'pwd'}) == 'undefined') {
      Misc.insert({name: 'pwd'});
    }
  };

  resetCollectionShip = function() {
    aa = Ship.find().fetch();
    for(ii = 0; ii < aa.length; ii++) {
      Ship.remove(aa[ii]._id);
    };
    Ship.insert({name: "Power", value: 900});
    Ship.insert({
      name: "Shields",
      value: true,
      front: 100,
      back: 100,
      top: 100,
      bottom: 100,
      left: 100,
      right: 100
    });
    Ship.insert({name: "lockedOn"});
    Ship.insert({name: "Coolant", value: 500});
    Ship.insert({name: "Speed", value: 0});
    Ship.insert({name: "Phasers1", value: 0});
    Ship.insert({name: "Phasers2", value: 0});
    Ship.insert({name: "Torpedoes", value: 25});
    Ship.insert({name: "Inbox Message", ship: "The Emperor's Fist", text: "Good luck on your mission!"});
    Ship.insert({name: "Outbox Message", ship: "", text: ""});
  };

  resetCollectionPower = function() {
    aa = Power.find().fetch();
    for(ii = 0; ii < aa.length; ii++) {
      Power.remove(aa[ii]._id);
    };
    insertPower("Warp", 200);
    insertPower("Phasers", 100);
    insertPower("Torpedoes", 50);
    insertPower("Shields", 150);
    insertPower("Computers", 100);
    insertPower("Systems", 100);
    insertPower("Communications", 50);
    insertPower("Sensors", 50);
    insertPower("Main Computer", 100);
  };

  resetCollectionEngineering = function () {
    aa = Engineering.find().fetch();
    for(ii = 0; ii < aa.length; ii++) {
      Engineering.remove(aa[ii]._id);
    };
    Engineering.insert({name: "Battery Box", focus: true});
  };

  resetCollectionScanning = function() {
    aa = Scanning.find().fetch();
    for(ii = 0; ii < aa.length; ii++) {
      Scanning.remove(aa[ii]._id);
    };
    Scanning.insert({name: "client", value: ""});
    Scanning.insert({name: "director", value: ""});
  };

  setShields = function(name) {
    if (name == "top") {
      strValue = document.getElementById('topShieldsBox').value;
      value = parseInt(strValue);
      Ship.update(Ship.findOne({name: "Shields"})._id, {$set: {top: value}});
    };
    if (name == "bottom") {
      strValue = document.getElementById('bottomShieldsBox').value;
      value = parseInt(strValue);
      Ship.update(Ship.findOne({name: "Shields"})._id, {$set: {bottom: value}});
    };
    if (name == "front") {
      strValue = document.getElementById('frontShieldsBox').value;
      value = parseInt(strValue);
      Ship.update(Ship.findOne({name: "Shields"})._id, {$set: {front: value}});
    };
    if (name == "back") {
      strValue = document.getElementById('backShieldsBox').value;
      value = parseInt(strValue);
      Ship.update(Ship.findOne({name: "Shields"})._id, {$set: {back: value}});
    };
    if (name == "right") {
      strValue = document.getElementById('rightShieldsBox').value;
      value = parseInt(strValue);
      Ship.update(Ship.findOne({name: "Shields"})._id, {$set: {right: value}});
    };
    if (name == "left") {
      strValue = document.getElementById('leftShieldsBox').value;
      value = parseInt(strValue);
      Ship.update(Ship.findOne({name: "Shields"})._id, {$set: {left: value}});
    };
  }

  insertPower = function(name, value) {
    Power.insert({name: name, enabled: true, powerUse: value, powerMax: value, temperature: 0});
    updateBar(name, value);
  }

  computerSpeak = function(text) {
    meSpeak.speak(text, {pitch: 100, variant: "whisper", wordgap: 2});
  };

  deepSpeak = function(text) {
    meSpeak.speak(text, {pitch: 0, speed: 150, variant: "croak"});
  };

  servantSpeak = function(text) {
    meSpeak.speak(text, {pitch: 75, speed: 125, wordgap: 4, variant: "f1"});
  };

  highSpeak = function(text) {
    meSpeak.speak(text, {pitch: 500, speed: 160, variant: "f5"});
  };

  speak = function(audio) {
    meSpeak.loadConfig("mespeak_config.json");
    meSpeak.loadVoice("voices/en/en-us.json");
    if (audio.voice == "computer") {
      computerSpeak(audio.text);
    }; 
    if (audio.voice == "high") {
      highSpeak(audio.text);
    };
    if (audio.voice == "deep") {
      deepSpeak(audio.text);
    };
    if (audio.voice == "servant") {
      servantSpeak(audio.text);
    };
    console.log(audio.text);
  };

  updateBar = function(name, value) {
    if (name == "Warp") {
      $('#warpBar').slider("option", "value", value / 2);
    };
    if (name == "Phasers") {
      $('#phasersBar').slider("option", "value", value);
    };
    if (name == "Torpedoes") {
      $('#torpedoesBar').slider("option", "value", value * 2);
    };
    if (name == "Shields") {
      $('#shieldsBar').slider("option", "value", value / 1.5);
    };
    if (name == "Computers") {
      $('#computersBar').slider("option", "value", value);
    };
    if (name == "Systems") {
      $('#systemsBar').slider("option", "value", value);
    };
    if (name == "Communications") {
      $('#communicationsBar').slider("option", "value", value * 2);
    };
    if (name == "Sensors") {
      $('#sensorsBar').slider("option", "value", value * 2);
    };
    if (name == "Main Computer") {
      $('#mainComputerBar').slider("option", "value", value);
    };
    obj = Power.findOne({name: name});
    Power.update(obj._id, {$set: {powerUse: value}});
    setEnabled(obj);
  };

  powerTotal = function() {
    aa = Power.find().fetch();
    total = 0;
    for(ii = 0; ii < aa.length; ii++) {
      total += aa[ii].powerUse;
    };
    return total;
  };

  setEnabled = function(obj) {
    if (obj.powerUse == obj.powerMax) {
      Power.update(obj._id, {$set: {enabled: true}});
    } else {
      Power.update(obj._id, {$set: {enabled: false}});
    };
  };

  fireWeapons = function(weapon) {
    obj = Ships.findOne({name: Ship.findOne({name: 'lockedOn'}).value});
    if ((weapon == 1) && (Ship.findOne({name: 'Phasers1'}).value == 100)) {
      Ship.update(Ship.findOne({name: 'Phasers1'})._id, {$set: {value: 0}});
      Ships.update(obj._id, {$set: {shields: obj.shields - 10}});
      progressBar(0, $('#phasers1Bar'), 3000);
    };
    if ((weapon == 2) && (Ship.findOne({name: 'Phasers2'}).value == 100)) {
      Ship.update(Ship.findOne({name: 'Phasers2'})._id, {$set: {value: 0}});
      Ships.update(obj._id, {$set: {shields: obj.shields - 10}});
      progressBar(0, $('#phasers2Bar'), 3000);
    };
    if ((weapon == 3) && (Ship.findOne({name: 'Torpedoes'}).value > 0)) {
      obj = Ship.findOne({name: 'Torpedoes'});
      Ship.update(obj._id, {$set: {value: obj.value - 1}});
      Ships.update(obj._id, {$set: {shields: obj.shields - 15}});
    };
    if ((obj.shields) < 0) {
      Ships.update(obj._id, {$set: {shields: 0}});
    };
  };

  chargeWeapons = function(weapon) {
    name = "Phasers" + weapon.toString();
    obj = Ship.findOne({name: name});
    Ship.update(obj._id, {$set: {value: 100}});
    name = '#phasers' + weapon.toString() + 'Bar';
    progressBar(100, $(name), 10000);
  };

  progressBar = function(percent, $element, len) {
    var progressBarWidth = percent * $element.width() / 100;
    $element.find('div').animate({ width: progressBarWidth }, len).html();
  }

  Template.coolant.helpers({
    warp: function() {
      return Power.findOne({name: "Warp"}).temperature;
    },
    phasers: function() {
      return Power.findOne({name: "Phasers"}).temperature;
    },
    torpedoes: function() {
      return Power.findOne({name: "Torpedoes"}).temperature;
    },
    shields: function() {
      return Power.findOne({name: "Shields"}).temperature;
    },
    computers: function() {
      return Power.findOne({name: "Computers"}).temperature;
    },
    systems: function() {
      return Power.findOne({name: "Systems"}).temperature;
    },
    communications: function() {
      return Power.findOne({name: "Communications"}).temperature;
    },
    sensors: function() {
      return Power.findOne({name: "Sensors"}).temperature;
    },
    mainComputer: function() {
      return Power.findOne({name: "Main Computer"}).temperature;
    },
    coolant: function() {
      return Ship.findOne({name: "Coolant"}).value;
    }
  });

  Template.weapons.helpers({
    ship: function() {
      value = Ship.findOne({name: "lockedOn"}).value;
      ship = Ships.findOne({name: value});
      return Ships.find({_id: ship._id});
    },
    torpedoesAmount: function() {
      return Ship.findOne({name: "Torpedoes"}).value;
    }
  });

  Template.HQMessage.helpers({
    reply: function() {
      return Misc.findOne({name: "HQToClient"}).value;
    }
  })

  Template.scanning.helpers({
    results: function() {
      return Scanning.findOne({name: "director"}).value;
    },
    scanning: function() {
      return Scanning.findOne({name: "client"}).value;
    }
  });

  Template.ship.helpers({
    values: function() {
      return Ship.find();
    }
  });

  Template.shielding.helpers({
    turnShields: function() {
      aa = Ship.findOne({name: "Shields"});
      if (aa.value == false) {
        value = "on";
      } else {
        value = "off";
      };
      return value;
    },
    topShields: function() {
      return Ship.findOne({name: "Shields"}).top;
    },
    bottomShields: function() {
      return Ship.findOne({name: "Shields"}).bottom;
    },
    frontShields: function() {
      return Ship.findOne({name: "Shields"}).front;
    },
    backShields: function() {
      return Ship.findOne({name: "Shields"}).back;
    },
    rightShields: function() {
      return Ship.findOne({name: "Shields"}).right;
    },
    leftShields: function() {
      return Ship.findOne({name: "Shields"}).left;
    }
  });

  Template.locking.helpers({
    shipList: function() {
      return Ships.find();
    }
  });

  Template.sendMessage.helpers({
    shipList: function() {
      return Ships.find();
    }
  });

  Template.header.helpers({
    station: function() {
      return Session.get("station");
    },
    name: function() {
      return Session.get("name");
    }
  });

  Template.soleusFlightDirector.helpers({
    speed: function() {
      value = Ship.findOne({name: "Speed"}).value;
      value = value.toString();
      if (value == "0") {
        value = "Full Stop";
      } else {
        value = "Warp " + value;
      };
      return value;
    },
    damageList: function() {
      return Engineering.find();
    },
    shipList: function() {
      return Ships.find();
    },
    stations: function() {
      return Stations.find();
    },
    warpCoolant: function() {
      return Power.findOne({name: "Warp"}).temperature;
    },
    phasersCoolant: function() {
      return Power.findOne({name: "Phasers"}).temperature;
    },
    torpedoesCoolant: function() {
      return Power.findOne({name: "Torpedoes"}).temperature;
    },
    shieldsCoolant: function() {
      return Power.findOne({name: "Shields"}).temperature;
    },
    computersCoolant: function() {
      return Power.findOne({name: "Computers"}).temperature;
    },
    systemsCoolant: function() {
      return Power.findOne({name: "Systems"}).temperature;
    },
    communicationsCoolant: function() {
      return Power.findOne({name: "Communications"}).temperature;
    },
    sensorsCoolant: function() {
      return Power.findOne({name: "Sensors"}).temperature;
    },
    mainComputerCoolant: function() {
      return Power.findOne({name: "Main Computer"}).temperature;
    },
    coolant: function() {
      return Ship.findOne({name: "Coolant"}).value;
    },
    warp: function() {
      return Power.findOne({name: "Warp"}).powerUse;
    },
    phasersPower: function() {
      return Power.findOne({name: "Phasers"}).powerUse;
    },
    torpedoesPower: function() {
      return Power.findOne({name: "Torpedoes"}).powerUse;
    },
    shieldsPower: function() {
      return Power.findOne({name: "Shields"}).powerUse;
    },
    computers: function() {
      return Power.findOne({name: "Computers"}).powerUse;
    },
    systems: function() {
      return Power.findOne({name: "Systems"}).powerUse;
    },
    communications: function() {
      return Power.findOne({name: "Communications"}).powerUse;
    },
    sensorsPower: function() {
      return Power.findOne({name: "Sensors"}).powerUse;
    },
    mainComputer: function() {
      return Power.findOne({name: "Main Computer"}).powerUse;
    },
    totalPower: function() {
      return powerTotal();
    },
    scanningParams: function() {
      return Scanning.findOne({name: "client"}).value;
    },
    shieldsOn: function() {
      if (Ship.findOne({name: "Shields"}).value == true) {
        value = "On";
      } else {
        value = "Off";
      }
      return value;
    },
    hqMessage: function() {
      return Misc.findOne({name: "ClientToHQ"}).value;
    },
    ShipPhasers1: function() {
      return Ship.findOne({name: "Phasers1"}).value;
    },
    ShipPhasers2: function() {
      return Ship.findOne({name: "Phasers2"}).value;
    },
    ShipTorpedoes: function() {
      return Ship.findOne({name: "Torpedoes"}).value;
    },
    shipMessage: function() {
      return Ship.find(Ship.findOne({name: "Outbox Message"})._id);
    }
  });

  Template.speed.helpers({
    speed: function() {
      value = Ship.findOne({name: "Speed"}).value;
      value = value.toString();
      if (value == "0") {
        value = "Full Stop";
      } else {
        value = "Warp " + value;
      };
      return value;
    }
  });

  Template.power.helpers({
    warp: function() {
      return Power.findOne({name: "Warp"}).powerUse;
    },
    phasers: function() {
      return Power.findOne({name: "Phasers"}).powerUse;
    },
    torpedoes: function() {
      return Power.findOne({name: "Torpedoes"}).powerUse;
    },
    shields: function() {
      return Power.findOne({name: "Shields"}).powerUse;
    },
    computers: function() {
      return Power.findOne({name: "Computers"}).powerUse;
    },
    systems: function() {
      return Power.findOne({name: "Systems"}).powerUse;
    },
    communications: function() {
      return Power.findOne({name: "Communications"}).powerUse;
    },
    sensors: function() {
      return Power.findOne({name: "Sensors"}).powerUse;
    },
    mainComputer: function() {
      return Power.findOne({name: "Main Computer"}).powerUse;
    },
    totalPower: function() {
      return powerTotal();
    },
    power: function() {
      return Ship.findOne({name: "Power"}).value;
    }
  });

  Template.damage.helpers({
    damageList: function() {
      return Engineering.find();
    },
    damageFocus: function() {
      value = Engineering.findOne({focus: true}).name;
      if (typeof value == undefined) {
        value = "none";
      };
      return value;
    }
  });

  Template.inbox.helpers({
    ship: function() {
      return Ship.findOne({name: "Inbox Message"}).ship;
    },
    message: function() {
      return Ship.findOne({name: "Inbox Message"}).text;
    }
  });

  Template.weapons.events({
    'click #charge1':function() {
      chargeWeapons(1);
    },
    'click #charge2':function() {
      chargeWeapons(2)
    },
    'click #discharge1': function() {
      if (Ship.findOne({name: "Phasers1"}).value == 100) {
        fireWeapons(1);
      };
    },
    'click #discharge2': function() {
      if (Ship.findOne({name: "Phasers2"}).value == 100) {
        fireWeapons(2);
      };
    },
    'click #fireTorpedo': function() {
      fireWeapons(3);
    }
  });

  Template.HQMessage.events({
    'click #hqMessagingButtonClient': function() {
      setMessage("ClientToHQ");
    }
  });

  Template.locking.events({
    'click #lockingDropdown': function(event) {
      value = event.target.value;
      Ship.update(Ship.findOne({name: "lockedOn"})._id, {$set: {value: value}});
    }
  });

  Template.sendMessage.events({
    'click #sendMessageClient': function() {
      ship = document.getElementById('messageDropdown').value;
      text = document.getElementById('messagingBoxClient').value;
      Ship.update(Ship.findOne({name: "Outbox Message"})._id, {$set: {ship: ship, text: text}});
    }
  });

  Template.scanning.events({
    'click #sendScan': function(event) {
      value = document.getElementById('sensorsScanning').value;
      Scanning.update(Scanning.findOne({name: "client"})._id, {$set: {value: value}});
    }
  });

  Template.shielding.events({
    'click #toggleShields': function() {
      aa = Ship.findOne({name: "Shields"});
      if (aa.value == false) {
        Ship.update(aa._id, {$set: {value: true}});
      } else {
        Ship.update(aa._id, {$set: {value: false}});
      };
    }
  });

  Template.coolant.events({
    'click .coolantBar': function(event) {
      value = event.target;
      if (value.id == "") {
        value = event.target.parentNode;
      };
      value = value.id.slice(4);
      obj = Power.findOne({name: value});
      Power.update(obj._id, {$set: {temperature: obj.temperature - 5}});
      obj = Ship.findOne({name: "Coolant"});
      Ship.update(obj._id, {$set: {value: obj.value - 5}});
      ready();
    }
  });

  Template.damage.events({
    'click .clientDamage': function(event) {
      value = event.target.id.slice(6);
      aa = Engineering.findOne({focus: true});
      if (typeof aa._id != undefined) {
        Engineering.update(aa._id, {$set: {focus: false}});
      }
      Engineering.update(Engineering.findOne({name: value})._id, {$set: {focus: true}});
    }
  });

  Template.speed.events({
    'click .warpButton': function(event) {
      value = parseInt(event.target.id.slice(4));
      Ship.update(Ship.findOne({name: 'Speed'})._id, {$set: {value: value}});
    }
  });

  Template.soleusFlightDirector.events({
    'click #resetAllButton': function() {
      resetCollectionScanning();
      resetCollectionPower();
      resetCollectionMisc();
      resetCollectionShip();
      resetCollectionStations();
      resetCollectionEngineering();
      resetCollectionShips();
    },
    'click #clearStations': function() {
      resetCollectionStations();
    },
    'click #clearEngineering': function() {
      resetCollectionEngineering();
    },
    'keypress #computerSpeakTextbox': function(event) {
      if (event.keyCode == 13) {
        temp = Misc.findOne({name: "meSpeak"});
        temp.text = document.getElementById('computerSpeakTextbox').value;
        temp.voice = "computer";
        temp.enabled = true;
        speak(temp);
        Misc.update(temp._id, temp);
      };
    },
    'keypress #highSpeakTextbox': function(event) {
      if (event.keyCode == 13) {
        temp = Misc.findOne({name: "meSpeak"});
        temp.text = document.getElementById('highSpeakTextbox').value;
        temp.voice = "high";
        temp.enabled = true;
        speak(temp);
        Misc.update(temp._id, temp);
      };
    },
    'keypress #deepSpeakTextbox': function(event) {
      if (event.keyCode == 13) {
        temp = Misc.findOne({name: "meSpeak"});
        temp.text = document.getElementById('deepSpeakTextbox').value;
        temp.voice = "deep";
        temp.enabled = true;
        speak(temp);
        Misc.update(temp._id, temp);
      };
    },
    'keypress #servantSpeakTextbox': function(event) {
      if (event.keyCode == 13) {
        temp = Misc.findOne({name: "meSpeak"});
        temp.text = document.getElementById('servantSpeakTextbox').value;
        temp.voice = "servant";
        temp.enabled = true;
        speak(temp);
        Misc.update(temp._id, temp);
      };
    },
    'keypress #scanningResultsTextbox': function(event) {
      if (event.keyCode == 13) {
        value = document.getElementById('scanningResultsTextbox').value;
        Scanning.update(Scanning.findOne({name: "director"})._id, {$set: {value: value}});
      };
    },
    'keypress #powerTotalText': function(event) {
      if (event.keyCode == 13) {
        strValue = document.getElementById('powerTotalText').value;
        value = parseInt(strValue);
        Ship.update(Ship.findOne({name: "Power"})._id, {$set: {value: value}});
      };
    },
    'keypress #topShieldsBox': function(event) {
      if (event.keyCode == 13) {
        setShields('top');
      };
    },
    'keypress #bottomShieldsBox': function(event) {
      if (event.keyCode == 13) {
        setShields('bottom');
      };
    },
    'keypress #frontShieldsBox': function(event) {
      if (event.keyCode == 13) {
        setShields('front');
      };
    },
    'keypress #backShieldsBox': function(event) {
      if (event.keyCode == 13) {
        setShields('back');
      };
    },
    'keypress #rightShieldsBox': function(event) {
      if (event.keyCode == 13) {
        setShields('right');
      };
    },
    'keypress #leftShieldsBox': function(event) {
      if (event.keyCode == 13) {
        setShields('left');
      };
    },
    'keypress #topShieldsBox': function(event) {
      if (event.keyCode == 13) {
        strValue = document.getElementById('topShieldsBox').value;
        value = parseInt(strValue);
        Ship.update(Ship.findOne({name: "Shields"})._id, {$set: {top: value}});
      };
    },
    'keypress #topShieldsBox': function(event) {
      if (event.keyCode == 13) {
        strValue = document.getElementById('topShieldsBox').value;
        value = parseInt(strValue);
        Ship.update(Ship.findOne({name: "Shields"})._id, {$set: {top: value}});
      };
    },
    'keypress #topShieldsBox': function(event) {
      if (event.keyCode == 13) {
        strValue = document.getElementById('topShieldsBox').value;
        value = parseInt(strValue);
        Ship.update(Ship.findOne({name: "Shields"})._id, {$set: {top: value}});
      };
    },
    'keypress #topShieldsBox': function(event) {
      if (event.keyCode == 13) {
        setShields("top");
      };
    },
    'keypress #damageInsert': function(event) {
      if (event.keyCode == 13) {
        value = document.getElementById('damageInsert').value;
        Engineering.insert({name: value, focus: false});
      };
    },
    'keypress .insertShip': function(event) {
      if (event.keyCode == 13) {
        name = document.getElementById('shipName').value;
        shieldsStr = document.getElementById('shipShields').value;
        shields = parseInt(shieldsStr);
        phasersStr = document.getElementById('shipPhasers').value;
        phasers = parseInt(phasersStr);
        enginesStr = document.getElementById('shipEngines').value;
        engines = parseInt(enginesStr);
        torpedoesStr = document.getElementById('shipTorpedoes').value;
        torpedoes = parseInt(torpedoesStr);
        insertShip(name,shields,phasers,engines,torpedoes);
      };
    },
    'click #clearPower': function(event) {
      resetCollectionPower();
      Ship.update(Ship.findOne({name: "Coolant"})._id, {$set: {value: 700}});
    },
    'click #clearScanning': function() {
      resetCollectionScanning();
    },
    'click #coolantDirector': function() {
      obj = Ship.findOne({name: "Coolant"});
      Ship.update(obj._id, {$set: {value: obj.value + 25}});
    },
    'click .damageItem': function(event) {
      value = event.target.id.slice(6);
      Engineering.remove(Engineering.findOne({name: value})._id);
      Engineering.update(Engineering.findOne()._id, {$set: {focus: true}});
      temp = Misc.findOne({name: "meSpeak"});
      temp.text = value + "has been fixed.";
      temp.voice = "computer";
      temp.enabled = true;
      speak(temp);
      Misc.update(temp._id, temp);
    },
    'click .shipItem': function(event) {
      value = event.target.id.slice(4);
      Ships.remove(Ships.findOne({name: value})._id);
    },
    'click .powerListItem': function(event) {
      value = event.target.id.slice(5);
      obj = Power.findOne({name: value});
      Power.update(obj._id, {$set: {temperature: obj.temperature + 3}});
    },
    'click .itemStation': function(event) {
      value = event.target.id.slice(7);
      obj = Stations.findOne({name: value});
      Stations.remove(obj._id);
    },
    'click #hqMessagingButtonDirector': function() {
      setMessage("HQToClient");
      temp = Misc.findOne({name: "meSpeak"});
      temp.text = "A message from Head Quarters has been recieved.";
      temp.voice = "computer";
      temp.enabled = true;
      speak(temp);
      Misc.update(temp._id, temp);
    },
    'keypress .weaponBox': function(event) {
      if (event.keyCode == 13) {
        id = event.target.id.slice(3);
        value = document.getElementById(event.target.id).value;
        Ship.update(Ship.findOne({name: id})._id, {$set: {value: parseInt(value)}});
      };
    },
    'click #sendShipMessage': function() {
      obj = Ship.findOne({name: "Inbox Message"});
      text = document.getElementById('shipMessageBoxDirector').value;
      name = document.getElementById('shipMessageNameDirector').value;
      Ship.update(obj._id, {$set: {text: text, ship: name}});
      temp = Misc.findOne({name: "meSpeak"});
      temp.text = "A message has been recieved.";
      temp.voice = "computer";
      temp.enabled = true;
      speak(temp);
      Misc.update(temp._id, temp);
    },
    'keypress .shipsPhasersText': function(event) {
      if (event.keyCode == 13) {
        id = event.target.id.slice(12);
        value = parseInt(event.target.value);
        obj = Ships.findOne({name: id});
        Ships.update(obj._id, {$set: {phasers: value}});
      };
    },
    'keypress .shipsTorpedoesText': function(event) {
      if (event.keyCode == 13) {
        id = event.target.id.slice(14);
        value = parseInt(event.target.value);
        obj = Ships.findOne({name: id});
        Ships.update(obj._id, {$set: {torpedoes: value}});
      };
    },
    'keypress .shipsShieldsText': function(event) {
      if (event.keyCode == 13) {
        id = event.target.id.slice(12);
        value = parseInt(event.target.value);
        obj = Ships.findOne({name: id});
        Ships.update(obj._id, {$set: {shields: value}});
      };
    },
    'keypress .shipsEnginesText': function(event) {
      if (event.keyCode == 13) {
        id = event.target.id.slice(12);
        value = parseInt(event.target.value);
        obj = Ships.findOne({name: id});
        Ships.update(obj._id, {$set: {engines: value}});
      };
    },
    'click #clearShips': function() {
      resetCollectionShips();
    },
    'click #insertShip': function() {
      name = document.getElementById('shipName').value;
      shieldsStr = document.getElementById('shipShields').value;
      shields = parseInt(shieldsStr);
      phasersStr = document.getElementById('shipPhasers').value;
      phasers = parseInt(phasersStr);
      enginesStr = document.getElementById('shipEngines').value;
      engines = parseInt(enginesStr);
      torpedoesStr = document.getElementById('shipTorpedoes').value;
      torpedoes = parseInt(torpedoesStr);
      insertShip(name,shields,phasers,engines,torpedoes);
    }
  });

  Template.soleusHome.events({
    'click #engineeringButton': function() {
      setInput();
      Session.set("station", "Engineering");
      insertStation("Engineering");
    },
    'click #navigationsButton': function() {
      setInput();
      Session.set("station", "Navigations");
      insertStation("Navigations");
    },
    'click #sensorsButton': function() {
      setInput();
      Session.set("station", "Sensors");
      insertStation("Sensors");
    },
    'click #primeOfficerButton': function() {
      setInput();
      Session.set("station", "Prime Officer");
      insertStation("Prime Officer");
    },
    'click #tacticalButton': function() {
      setInput();
      Session.set("station", "Tactical");
      insertStation("Tactical");
    }
  });

  Template.soleusFlightDirectorLogin.events({
    'keypress #flightPassword': function(event) {
      if (event.keyCode == 13) {
        Meteor.call('checkPasswordSoleus',event.target.value);
      };
    }
  });

  clickNav1 = function() {
    $('.navCard2').removeClass('navCardSelected', 650, "easeOutCubic");
    $('.navCard3').removeClass('navCardSelected', 650, "easeOutCubic");
    $('.navCard1').addClass('navCardSelected', 650, "easeOutCubic");
  };

  clickNav2 = function() {
    $('.navCard1').removeClass('navCardSelected', 650, "easeOutCubic");
    $('.navCard3').removeClass('navCardSelected', 650, "easeOutCubic");
    $('.navCard2').addClass('navCardSelected', 650, "easeOutCubic");
  };

  clickNav3 = function() {
    $('.navCard1').removeClass('navCardSelected', 650, "easeOutCubic");
    $('.navCard2').removeClass('navCardSelected', 650, "easeOutCubic");
    $('.navCard3').addClass('navCardSelected', 650, "easeOutCubic");
  };

  Template.engineeringSide.events({
    'click .navCard1': function() {
      clickNav1();
    },
    'click .navCard2': function() {
      clickNav2();
      setTimeout(function() {
        ready();
      }, 10);
    },
    'click .navCard3': function() {
      clickNav3();
      setTimeout(function() {
        ready();
      }, 10);
    }
  });

  Template.navigationsSide.events({
    'click .navCard1': function() {
      clickNav1();
    },
    'click .navCard2': function() {
      clickNav2();
    },
    'click .navCard3': function() {
      clickNav3();
    }
  });

  Template.sensorsSide.events({
    'click .navCard1': function() {
      clickNav1();
    },
    'click .navCard2': function() {
      clickNav2();
    },
    'click .navCard3': function() {
      clickNav3();
    }
  });

  Template.primeOfficerSide.events({
    'click .navCard1': function() {
      clickNav1();
    },
    'click .navCard2': function() {
      clickNav2();
    },
    'click .navCard3': function() {
      clickNav3();
    }
  });

  Template.tacticalSide.events({
    'click .navCard1': function() {
      clickNav1();
    },
    'click .navCard2': function() {
      clickNav2();
      setTimeout(function() {
        ready();
      }, 10);
    },
    'click .navCard3': function() {
      clickNav3();
    }
  });

  meSpeakLoop = function() {
    window.requestAnimationFrame(meSpeakLoop);
    obj = Misc.findOne({name: "meSpeak"});
    if (obj.enabled == true) {
      speak(obj);
      Misc.update(obj._id, {$set: {enabled: false}});
    };
  };

}

if (Meteor.isServer) {
  Meteor.startup(function () {
    console.log("Space Server is running");
  });
};

Meteor.methods({
  checkPasswordSoleus: function(pass) {
    if (pass == "p@$$w0rD") {
      if (Meteor.isServer) {
        pwd = Random.secret();
        Misc.update(Misc.findOne({name: 'pwd'})._id, {$set: {value: pwd}});
      };
      if (Meteor.isClient) {
        setTimeout(function() {
          window.location.href = '/soleus/fl/' + Misc.findOne({name: 'pwd'}).value;
        }, 3000);
      }
    } else {
      if (Meteor.isClient) {
        window.location.href = "/soleus";
      };
    };
    return false;
  }
});