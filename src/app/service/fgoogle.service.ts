import { Injectable } from '@angular/core';
import firebase from 'firebase/app';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { HttpService } from './http.service';


@Injectable({
  providedIn: 'root'
})
export class FgoogleService {

  private user: any;

  constructor(private afAuth: AngularFireAuth,
    private router: Router, private firestore: AngularFirestore,
    private http: HttpService) {

  }

  async signInWithGoogle() {
    const credientals = await this.afAuth.signInWithPopup(new firebase.auth.GoogleAuthProvider());
    this.user = {
      uid: credientals.user.uid,
      displayName: credientals.user.displayName,
      email: credientals.user.email
    };
    const wait = await this.add_user(this.user)
    this.router.navigate(["home"]);
  }

  signOut() {
    this.afAuth.signOut();
    localStorage.removeItem("user");
    this.user = null;
    this.router.navigate(["login"]);
  }

  async add_news(user, country, description, new_cases, new_recovered, new_deaths) {

    if (!country || !description || !new_cases || !new_recovered || !new_deaths) {
      return { error: true, message: "missing input!" };
    } else {
      try {
        country = country.charAt(0).toUpperCase() + country.slice(1)
        let news = {
          country: country,
          description: description,
          new_cases: new_cases,
          new_recovered: new_recovered,
          new_deaths: new_deaths,
          user: (await JSON.parse(user)).displayName,
          date: new Date()
        }
        if (country.toLowerCase()=="worldwide"){
          let doc = await this.firestore.collection("countries").doc(country).get().toPromise();

          if (doc.exists){
            console.log("worldwide mawjoud")
            let aux = doc.data()
            aux["news"].push(news)
            await this.firestore.collection("countries").doc(country).set(aux, { merge: true });

          }
          else {
            console.log("worldwide mch mawjoud")
            let aux = new Object()
            let ls = []
            ls.push(news)
            aux['news'] = ls
            await this.firestore.collection("countries").doc(country).set(aux, { merge: true });
          }
          


        }
        else {

        let doc = await this.firestore.collection("countries").doc(country).get().toPromise();
        
        if (doc.exists) {
          let aux = doc.data()
          if (aux['news'] != undefined) {
            aux['news'].push(news)
            await this.firestore.collection("countries").doc(country).set(aux, { merge: true });
          } else {
            let ls = []
            ls.push(news)
            aux['news'] = ls
            await this.firestore.collection("countries").doc(country).set(aux, { merge: true });
          }

        }
        else {
          console.log("country mch mawjouda hani chnasnaaha")
          await this.http.getFromCovidApi("summary").then(x => {

            for (let element of x['Countries']) {
              if (element.Country == country) {
                console.log("l9it l country fil API",element.Country,country)
                element.news = [news];
                

                this.firestore.collection("countries").doc(country).set(element, { merge: true });

                break; 
              }
            };
          })
        }
      }

        return { error: false, message: "successfully added news !" };

      } catch (err) {
        return { error: true, message: err };

      }

    }

  }

  check_eligibility() {

  }

  async get_news(country) {
    try {
      let doc = await this.firestore.collection("countries").doc(country).get().toPromise();
      if (doc.exists) {
        let a = doc.data()
        if (a['news'] != undefined) {
          let ls: Array<any> = a['news']
          if (ls.length < 10) {
            return ls
          } else {
            let res = []
            for (let index = ls.length - 1; index > 0; index--) {
              res.push(ls[index]);
            }
            return res
          }
        }
        return undefined
      }
      return undefined
    } catch {
      return undefined
    }
  }

  async save_country_data(country, data) {
    try {
      let myDate = new Date();
      let doc = await this.firestore.collection("countries").doc(country).get().toPromise()
      if (doc.exists) {
        if (!(doc.data()['date'].getDate() == myDate.getDate() && doc.data()['date'].getMonth() == myDate.getMonth() && doc.data()['date'].getFullYear() == myDate.getFullYear())) {
          await this.firestore.collection("countries").doc(country).set(data)
          return true
        }
        return true
      } else {
        await this.firestore.collection("countries").doc(country).set(data)
        return true
      }
    }
    catch {
      return false
    }
  }

  async add_user(user) {
    if (user.email != undefined && user.uid != undefined && user.displayName != undefined) {
      let check = await this.firestore.collection("users").doc(user.email).get().toPromise();
      if (!check.exists) {
        let doc = {
          uid: user.uid,
          displayName: user.displayName,
          email: user.email,
          can_add: false,
          edited: new Date()
        }
        await this.firestore.collection("users").doc(user.email).set(doc, { merge: true });
        localStorage.setItem("user", JSON.stringify(doc));
        return true
      }
      localStorage.setItem("user", JSON.stringify(check.data()));
      return true
    }
  }




}

