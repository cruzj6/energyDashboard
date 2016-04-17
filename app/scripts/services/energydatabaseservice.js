'use strict';

/**
 * @ngdoc service
 * @name energydashApp.energyDatabaseService
 * @description
 * # energyDatabaseService
 * Service in the energydashApp.
 */
angular.module('energydashApp')
  .service('energyDatabaseService', function ($q, $firebase, $firebaseObject, $firebaseArray) {
      var fbURL = 'https://boiling-inferno-6354.firebaseio.com';

      var fbRef = new Firebase(fbURL);
      fbRef.unauth();

      return {

        //Add a user to the database
        addUser: function (email, pass, handleUserAdded) {
          fbRef.createUser({
            email: email,
            password: pass,
          }, function (err, usrData) {
            var isSuccess;
            if (err) {
              //If an error
              console.log('Error adding user to database' + err);
              isSuccess = false;
            }
            else {
              //On success
              fbRef.child('users').child(usrData.uid).set({ email: email });
              console.log(email + " added to database with UserId: " + usrData.uid);
              isSuccess = true;
            }
            handleUserAdded(isSuccess, err);
          });
        },

        //Log user into the database
        logUserIn: function (email, pass, handleLogin) {
          fbRef.authWithPassword({
            email: email,
            password: pass,
          }, function (err, data) {
            var isSuccess;
            if (err) {
              isSuccess = false;
              console.log("Error logging user in Error: " + err);
            }
            else {
              isSuccess = true;
              console.log("USer logged in successfully uid: " + data);
            }
            handleLogin(isSuccess);

          });
        },

        //Add straight data to the db root
        addDataToRoot: function (data) {
          var deferred = $q.defer();
          fbRef.set(data, deferred.resolve);
          return deferred.promise;
        },

        pushDataToPath: function (path, data) {
          var deferred = $q.defer();
          fbRef.child(path).push(data, deferred.resolve);
          return deferred.promise;
        },

        getDataByPath: function (childrenRelPath) {
          var deferred = $q.defer();
          fbRef.child(childrenRelPath).on('value', function (data) {
            deferred.resolve(data.val())
          }, deferred.reject);
          return deferred.promise;
        },

        //Num is the number if entries to get (Most recent)
        getEnergyData: function(num, energyDataCallback)
        {
          var ref = fbRef.child('energydata');

          // download the data from a Firebase reference into a (pseudo read-only) array
          // all server changes are applied in realtime
          var dataRefs = ref.orderByChild('timestamp').limitToLast(num);
          var datas = $firebaseArray(dataRefs);

          //Callback with the data
          //TODO: I dont think we need to bind this data to the view, so I'm just returning it
          //TODO: this way
          datas.$loaded().then(function(x){
            energyDataCallback(datas)
          });
        },

        //Add an energyData object (one object per day the data was taken, holding data for each building,
        //it will be timestamped by firebase automatically)
        addEnergyDataForDay: function(energyData)
        {
          var energyDataPath = fbRef.child('/energydata');
          $firebaseArray(energyDataPath).$add(energyData);
        },

        updateData: function (data) {
          var building,
              i = 0,
              deferredArr = [];

          // Set node data for every building
          for (building in data.perBuilding) {
            deferredArr.push($q.defer());
            fbRef.child('perBuilding').child(building).update({
              total: data.perBuilding[building].total,
              name: data.perBuilding[building].name,
              maximum: data.perBuilding[building].maximum,
              minimum: data.perBuilding[building].minimum,
              average: data.perBuilding[building].average
            });
            // Update date data
            fbRef.child('perDate').update(data.perDate);
            // Update building data per date
            fbRef.child('perBuilding').child(building).child('dates').update(data.perBuilding[building].dates, function () {
              deferredArr[i].resolve(true);
              i += 1;
            });
          }

          // Return array of promises
          return $q.all(deferredArr.map(function (deferredObj) {
            return deferredObj.promise;
          }));
        },

        getUserAuthData: function()
        {
          var authData = fbRef.getAuth();
          return authData? authData : null;
        },

        getUserSignedIn: function()
        {
          var authData = fbRef.getAuth();
          if(authData)
          {
            return true;
          }
          else
          {
            return false;
          }
        }
      }
  });
