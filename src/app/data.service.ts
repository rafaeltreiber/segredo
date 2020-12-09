import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, DocumentReference } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators'
import { AngularFireAuth } from '@angular/fire/auth';

export interface User {
  uid: string;
  email: string;
}

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private Partidas: Observable<Partida[]>;
  private ColecaodePartidas: AngularFirestoreCollection<Partida>;
  currentUser: User = null;

  constructor(private afs: AngularFirestore, private afAuth: AngularFireAuth) {
    this.afAuth.onAuthStateChanged((user) => {
      this.currentUser = user;
    });
    this.ColecaodePartidas = this.afs.collection<Partida>('partidas');
    this.Partidas = this.ColecaodePartidas.snapshotChanges().pipe(
      map(actions => {
        return actions.map(a => {
          const data = a.payload.doc.data();
          const id = a.payload.doc.id;
          return { id, ...data };
        });
      })
    );
  }

  getAll(): Observable<Partida[]> {   
    return this.Partidas;
  }

  async getUserEmail()
  {
    return this.currentUser.email;
  }

  getPartida(id: string): Observable<Partida> {
    return this.ColecaodePartidas.doc<Partida>(id).valueChanges().pipe(
      take(1),
      map(partida => {
        partida.id = id;
        return partida;
      })
    );
  }

  addPartida(partida: Partida): Promise<DocumentReference> {    
    //Outro jeito de salvar, mas não salva o id junto na base  
   // return this.ColecaodePartidas.add(partida);

   var temppart = {
     id: partida.id,
     id_oponente: partida.id_oponente,
     imgX: partida.imgX,
     imgY: partida.imgY,
     email: partida.email,
     situacao: partida.situacao,
     turno: partida.turno,
     matriz_propria: JSON.stringify(partida.matriz_propria),
     matriz_oponente: JSON.stringify(partida.matriz_oponente)
   }

   //get id from firestore
   temppart.id = this.afs.createId();    
   return this.afs.collection('partidas').doc(temppart.id).set(temppart).then();
  }

  updatePartida(partida: Partida): Promise<void> {
    //Esse abaixo não funciona porque o firebase não consegue salvar matrizes multidimensionais
    //e se usar stringify, a função não aceita pois espera uma variável do tipo Partida, que
    //tem matrizes multidimensionais tipo number
    //return this.ColecaodePartidas.doc(temppart.id).update(partida);
    return this.afs.collection('partidas').doc(partida.id).update({
      id: partida.id,
      id_oponente: partida.id_oponente,
      imgX: partida.imgX,
      imgY: partida.imgY,
      email: partida.email,
      situacao: partida.situacao,
      turno: partida.turno,
      matriz_propria: JSON.stringify(partida.matriz_propria),
      matriz_oponente: JSON.stringify(partida.matriz_oponente)
    });
  }

  deletePartida(key_propria: string): Promise<void> {
    return this.ColecaodePartidas.doc(key_propria).delete();
  }

  async signup({ email, password }): Promise<any> {
    const credential = await this.afAuth.createUserWithEmailAndPassword(
      email,
      password
    );

    const uid = credential.user.uid;

    return this.afs.doc(
      `users/${uid}`
    ).set({     
      uid,
      email: credential.user.email,
    })
  }

  signIn({ email, password }) {
    return this.afAuth.signInWithEmailAndPassword(email, password);
  }

  signOut(): Promise<void> {
    return this.afAuth.signOut();
  }
}

export class Partida {
  id?: string;
  id_oponente?: string;
  imgX?: number;
  imgY?: number;
  email?: string;
  situacao: string;
  turno: boolean;
  matriz_propria: number[][] = [];
  matriz_oponente: number[][] = [];

  constructor() {
    this.id = "";
    this.id_oponente = "";
    this.imgX = 0;
    this.imgY = 0;
    this.email = "";
    this.situacao = "";
    this.turno = false;    
    this.matriz_propria = [
      [ 999, 999, 999, 999, 999, 999, 999, 999, 999, 999],
      [ 999, 999, 999, 999, 999, 999, 999, 999, 999, 999],
      [ 999, 999, 999, 999, 999, 999, 999, 999, 999, 999],
      [ 999, 999, 999, 999, 999, 999, 999, 999, 999, 999],
      [ 999, 999, 999, 999, 999, 999, 999, 999, 999, 999],
      [ 999, 999, 999, 999, 999, 999, 999, 999, 999, 999]
    ]

    this.matriz_oponente = [
      [ 999, 999, 999, 999, 999, 999, 999, 999, 999, 999],
      [ 999, 999, 999, 999, 999, 999, 999, 999, 999, 999],
      [ 999, 999, 999, 999, 999, 999, 999, 999, 999, 999],
      [ 999, 999, 999, 999, 999, 999, 999, 999, 999, 999],
      [ 999, 999, 999, 999, 999, 999, 999, 999, 999, 999],
      [ 999, 999, 999, 999, 999, 999, 999, 999, 999, 999]
    ]
  }
}
