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
      
   // return this.ColecaodePartidas.add(partida);
   
   //get id from firestore
   partida.id = this.afs.createId(); 
   return this.afs.collection('partidas').doc(partida.id).set(partida).then();
  }

  updatePartida(partida: Partida): Promise<void> {
    return this.ColecaodePartidas.doc(partida.id).update({
      id: partida.id,
      key_oponente: partida.key_oponente, imgX: partida.imgX, imgY: partida.imgY, nome: partida.nome,
      situacao: partida.situacao, turno: partida.turno, matriz_propria: partida.matriz_propria,
      matriz_oponente: partida.matriz_oponente
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
  key_oponente?: string;
  imgX?: number;
  imgY?: number;
  nome?: string;
  situacao: string;
  turno: boolean;
  matriz_propria: number[][] = [];
  matriz_oponente: number[][] = [];
}
