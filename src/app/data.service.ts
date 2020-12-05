import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, DocumentReference } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators'

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private Partidas: Observable<Partida[]>;
  private ColecaodePartidas: AngularFirestoreCollection<Partida>;

  constructor(private afs: AngularFirestore) { 
    this.ColecaodePartidas = this.afs.collection<Partida>('partidas');
    this.Partidas = this.ColecaodePartidas.snapshotChanges().pipe(
      map( actions => {
        return actions.map(a => {
          const data = a.payload.doc.data();
          const key_propria = a.payload.doc.id;
          return { key_propria, ...data };
        });
      })
    );
  }

  getAll(): Observable<Partida[]> {
    return this.Partidas;
  }

  getPartida(key_propria: string): Observable<Partida> {
    return this.ColecaodePartidas.doc<Partida>(key_propria).valueChanges().pipe(
      take(1),
      map (partida => {
        partida.key_propria = key_propria;
        return partida;
      })
    );
  }

  addPartida(partida: Partida): Promise<DocumentReference> {
    return this.ColecaodePartidas.add(partida);
  }

  updatePartida(partida: Partida): Promise<void> {
   return this.ColecaodePartidas.doc(partida.key_propria).update({key_propria: partida.key_propria, 
     key_oponente: partida.key_oponente, imgX: partida.imgX, imgY: partida.imgY, nome: partida.nome,
     situacao: partida.situacao, turno: partida.turno, matriz_propria: partida.matriz_propria,
     matriz_oponente: partida.matriz_oponente});
 }

 deletePartida(key_propria: string): Promise<void> {
   return this.ColecaodePartidas.doc(key_propria).delete();
 }
}

export class Partida {
  key_propria: string;  
  key_oponente: string;  
  imgX?: number;
  imgY?: number;
  nome: string;
  situacao: string;
  turno: boolean;
  matriz_propria: number[][] = [];
  matriz_oponente: number[][] = [];  
}
