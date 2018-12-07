export class Pet {
    constructor(
        public _id: string,
        public name_pet: string,
        public weight: string,
        public born: string,
        //public hComida:["","","","","","","","","",""],
        
        
        public hComida1:string,
        public hComida2:string,
        public hComida3:string,
        public hComida4:string,
        public hComida5:string,
        public hComida6:string,
        public hComida7:string,
        public hComida8:string,
        
        
        public fechaComida:string,
        public raza: string,
        public sex: string,
        public quantity: string,
        public shots: string,
        public image_pet: string,
        public mac: string,
        public aux: number,
        public alerta:string,
        public created_at: string,
        public user: string
    ){}
}