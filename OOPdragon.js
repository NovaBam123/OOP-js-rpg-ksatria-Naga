const staminaText= document.getElementById('staminaText');
const emasText= document.getElementById('emasText');
const btn1= document.getElementById('btn1');
const btn2= document.getElementById('btn2');
const btn3= document.getElementById('btn3');
const text= document.getElementById('text');
const monsterStats= document.getElementById('monsterStats');
const monsterHealthText= document.getElementById('monsterHealthText');
const monsterName= document.getElementById('monsterName');
const xpText= document.getElementById('xpText');
let emojis= ['🗡️'];
const clickbtn= new Audio('sound/input.mp3')

class Senjata{
    constructor(namaSenjata, power){
        this.namaSenjata= namaSenjata;
        this.power= power;
    }
    toString() {
        return `${this.namaSenjata}`;
    }
}

class Monster{
    constructor(name, level, health){
        this.name= name;
        this.level= level;
        this.health= health;
    }
}

class Player{
    constructor(){
        this.xp = 0;
        this.stamina = 100;
        this.emas = 50;
        this.currentWeaponIndex = 0;
        this.inventory= [Game.senjataList[0]];
    }
}
class Game{
    static senjataList= [
        new Senjata('tongkat', 5),
        new Senjata('belati', 30),
        new Senjata('cakar-besi', 60),
        new Senjata('pedang', 100),
    ];
    static monsterList= [
        new Monster('slime', 2, 15),
        new Monster('beast', 8, 60),
        new Monster('naga', 20, 300),
    ]
    static changeBtnToSell(gameInstance){
        btn2.innerText= 'Jual Senjata (15 emas)';
        btn2.onclick= ()=> gameInstance.jualSenjata();
    }
    constructor(){
        this.player= new Player();
        this.fighting= null;
        this.SoundManager= new SoundManager();
    }
    keToko= ()=> {
        this.updateLocation(0);
        this.SoundManager.play('btnClick');
    }    
    keKota= ()=> {
        this.updateLocation(1);
        this.SoundManager.play('keKota');
    }    
    keGoa=()=> {
        this.updateLocation(2);
        this.SoundManager.play('keGoa');
    }
    beliStamina= ()=> {
        if(this.player.emas>= 10){
            this.player.emas-= 10;
            this.player.stamina+= 10;
            emasText.textContent= this.player.emas;
            staminaText.textContent= this.player.stamina;
            text.textContent= 'Sepuluh stamina telah dibeli.';
        }
        else{
            alert('Emas tidak mencukupi!');
        }
    }
    beliSenjata= ()=> {
        this.SoundManager.play('senjata');
        if (this.player.currentWeaponIndex < Game.senjataList.length - 1) {
            if (this.player.emas >= 30) {
              this.player.emas -= 30;
              this.player.currentWeaponIndex++;
              let senjataBaru = Game.senjataList[this.player.currentWeaponIndex];
              this.player.inventory.push(senjataBaru);
              emasText.textContent = this.player.emas;
              text.textContent = `Senjata ${senjataBaru.namaSenjata} telah dibeli. Senjata di inventori: ${this.player.inventory}.`;
            //   console.log(this.player.inventory);
            } else {
              alert("Emas tidak mencukupi!");
            }
          }else {
            alert('Pedang sudah dimiliki dan senjata yang terkuat!');
            Game.changeBtnToSell(this);
          }
    }
    jualSenjata(){
        if(this.player.inventory.length > 1){
            this.player.emas+= 15;
            emasText.innerText= this.player.emas;
            let senjataDiJual= this.player.inventory.shift();
            if(this.player.currentWeaponIndex> 0){
                this.player.currentWeaponIndex--;
            }
            text.innerText= `Senjata ${senjataDiJual} telah terjual. Senjata di inventory: ${this.player.inventory}.`;
        } else {
            alert('Tidak bisa menjual satu-satunya senjata!');
        }
    }
    lawanNaga= ()=> {
        this.bertempur(2);
        this.SoundManager.play('dragonBreath');
    }
    lawanSlime= ()=> {
        this.bertempur(0);
        this.SoundManager.play('slime');
    }
    lawanBeast= ()=> {
       this.bertempur(1);
       this.SoundManager.play('slime');
    }
    bertempur= (idx)=> {
        const monsterTemplate= Game.monsterList[idx];
        this.fighting= new Monster(
            monsterTemplate.name,
            monsterTemplate.level,
            monsterTemplate.health,
        )
        this.fightingIndex= idx;
        this.updateLocation(3);
        monsterStats.style.display= 'block';
        monsterHealthText.textContent= this.fighting.health;
        monsterName.textContent= this.fighting.name;
    }
    serang= ()=> {
        this.SoundManager.play('serang');
        let currentWeapon= this.player.inventory[this.player.currentWeaponIndex];
        let namaSenjata= currentWeapon.namaSenjata;
        /*
        console.log(this.fighting.level);
        console.log('this.fighting:', Game.monsterList[2]);
        */
        text.textContent= `Monster ${this.fighting.name} menyerang!`;
        text.textContent+= ` Kamu menyerang balik dg ${namaSenjata}!`;
        this.player.stamina-= this.seranganMonster(this.fighting.level);
        /*
        console.log('stamina:', this.player.stamina);
        console.log('monsterHealth:', this.fighting.health);
        console.log('weaponPower:', currentWeapon.power);
        console.log('xp:', this.player.xp);
        */
        if(this.seranganKena()){
            this.fighting.health-= currentWeapon.power+ Math.floor(Math.random()* this.player.xp)+ 1;
        } else {
            setTimeout(()=>alert('Serangan kamu meleset!'), 1500);
        }
        staminaText.textContent= this.player.stamina;
        monsterHealthText.textContent= this.fighting.health;

        if(this.player.stamina <= 0) this.kalah();
        else if(this.fighting.health <= 0){
            if(this.fightingIndex=== 2){
                this.youWin();
            }else {
                this.mengalahkanMonster();
            }
        }
        if(Math.random()<= 0.3 && this.player.inventory.length!== 1){
            alert('Senjata patah karena kulit monster yang tebal!')
            let senjataPatah= this.player.inventory.pop();
            text.innerText+= ` Senjata ${senjataPatah.namaSenjata} patah.`
            if (this.player.currentWeaponIndex >= this.player.inventory.length) {
                this.player.currentWeaponIndex = this.player.inventory.length - 1;
            }
        }
    }   
        seranganMonster(level) {
            const hit= (level*5)- (Math.floor(Math.random())* this.player.xp);
            return hit > 0 ? hit : 0;
        }
        seranganKena() {
            return Math.random()> 0.5;
        }
        kalah= ()=> {
            setTimeout(()=>this.SoundManager.play('manScream'), 2500);
            setTimeout(()=> alert('Kamu mati..☠!'), 1500);
            this.updateLocation(4);
        }
        mengalahkanMonster(){
            this.SoundManager.play('monsterMati');
            setTimeout(()=> alert('Monster berteriak kesakitan dan mati.'), 1500);
            this.player.xp+= this.fighting.level;
            this.player.emas+= Math.floor(this.fighting.level* 6.5);
            xpText.textContent= this.player.xp;
            emasText.textContent= this.player.emas;
            this.updateLocation(5);
        }
        youWin= ()=> {
            this.SoundManager.play('dragonDeath');
            setTimeout(()=>alert('Monster dragon berteriak dan mati. 🎉 Selamat anda Menang!'), 1500);
            this.updateLocation(6);
        }
        restart= ()=> {
            this.player.xp= 0;
            this.player.stamina= 100;
            this.player.emas= 50;
            this.player.currentWeaponIndex= 0;
            this.player.inventory= [Game.senjataList[0]];
            this.fighting= null;
            monsterHealthText.textContent= this.fighting;
            xpText.textContent= this.player.xp;
            staminaText.textContent= this.player.stamina;
            emasText.textContent= this.player.emas;
            this.keKota();
        }
        easterEgg= ()=>  {
            this.updateLocation(7);
        }
        pilihan(angkaUser) {
            const numbers= [];
            while(numbers.length< 10){
                numbers.push(Math.floor(Math.random()* 11));
            }
            text.innerText= `Pilihan kamu ${angkaUser}. Ini daftar angka tsb: \n`;
            for(let i=0; i< 10; i++){
                text.textContent+= numbers[i] + '\n';
            }
            if(numbers.includes(angkaUser)){
                alert('Tebakan mu benar! Hadiah 20 emas telah ditambahkan');
                this.player.emas+= 20;
                emasText.textContent= this.player.emas;
            }else {
                alert('Tebakan-mu Salah, kamu kehilangan 10 stamina');
                this.player.stamina-= 10;
                staminaText.textContent= this.player.stamina;
                if(this.player.stamina<= 0) this.kalah();
            }    
        }
        pilihDua= ()=> {
            this.pilihan(2);
        }
        pilihDelapan= ()=> {
            this.pilihan(8);
        }
        lari= ()=> {
            this.keKota();
        }
        hindar= ()=> {
             text.textContent= `Ksatria menghindari dari serangan ${this.fighting.name}.`
        }

    updateLocation(idx){
        monsterStats.style.display= 'none';
        const currentLocation= locations[idx];
        btn1.innerText= currentLocation['button text'][0];
        btn2.innerText= currentLocation['button text'][1];
        btn3.innerText= currentLocation['button text'][2];
        btn1.onclick= currentLocation['button function'][0];
        btn2.onclick= currentLocation['button function'][1];
        btn3.onclick= currentLocation['button function'][2];
        text.textContent= currentLocation.text;
    }
    start() {
        locations[0]['button function']= [this.beliStamina, this.beliSenjata, this.keKota];

        locations[1]['button function']= [this.keToko, this.keGoa, this.lawanNaga];

        locations[2]['button function']= [this.lawanSlime, this.lawanBeast, this.keKota];

        locations[3]['button function']= [this.serang, this.hindar, this.lari];

        locations[4]['button function']= [this.restart, this.restart, this.restart];

        locations[5]['button function']= [this.keKota, this.keKota, this.easterEgg];

        locations[6]['button function']= [this.restart, this.restart, this.restart];

        locations[7]['button function']= [this.pilihDua, this.pilihDelapan, this.keKota];
    }
}
const locations= [
    {
        name: 'Toko',
        'button text': ['Beli 10 Stamina (10 Emas)', 'Beli Senjata (30 Emas)', 'Ke Kota'],
        text: 'Kamu sekarang berada di Toko.'
    },
    {
        name: 'Kota',
        'button text': ['Ke Toko', 'Ke Goa', 'Lawan Naga'],
        text: 'Kamu sekarang berada di Alun-alun Kota.'
    },
    {
        name: 'Goa',
        'button text': ["Lawan Monster Slime", "Lawan Monster Beast", "Kembali ke Kota"],
        text: 'Kamu sekarang berada di Goa. Kamu melihat beberapa monster.'
    },
    {
        name: 'Pertempuran',
        'button text': ["Serang", "Menghindar", "Lari"],
        text: 'Kamu bertempur dengan monster.'
    },
    {
        name: 'Kalah',
        'button text' : ['REPLAY?', 'REPLAY?', 'REPLAY?'],
        text: 'Apakah kamu mau mengulang untuk menang? klik tombol diatas.'
    },
    {
        name: 'Mengalahkan Monster',
        'button text': ['ke Kota', 'ke Kota', 'easterEgg'],
        text: 'Kamu mendapat tambahan XP dan menemukan emas disekitar tempat tersebut.'
    },
    {
        name: 'Menang',
        'button text': ['RESTART?', 'RESTART?', 'RESTART?'],
        text: 'Warga pun hidup dengan damai kembali &#x1F389.'
    },
    {
        name: 'Easter Egg',
        'button text': ['2', '8', 'Pergi ke Kota?'],
        text: 'Kamu menemukan rahasia permainan. Pilih salah satu no diatas. Sepuluh angka akan diacak dan dipilih antara 0 dan 10. Jika no kamu ada dalam daftar tersebut. kamu menang 20 emas.'
    }
]

class SoundManager{
    constructor(){
        this.sounds= {
            keGoa: new Audio('sound/deep-sea-monster-[AudioTrimmer.com].mp3'),
            btnClick: new Audio('sound/input.mp3'),
            keKota: new Audio ('sound/sms-received1.mp3'),
            slime: new Audio ('sound/monster01-growl.mp3'),
            serang: new Audio ('sound/sword-slash.mp3'),
            monsterMati: new Audio('sound/monster01-roar.mp3'),
            senjata: new Audio('sound/phone sound-[AudioTrimmer.com].mp3'),
            dragonBreath: new Audio('sound/monster-breath.mp3'),
            dragonDeath: new Audio ('sound/children-yay.mp3'),
            manScream: new Audio('sound/man-scream.mp3')
        }
    }
    play(namaSound){
        this.sounds[namaSound].currentTime= 0;
        this.sounds[namaSound].play();
    }
}

const game= new Game();
game.start();
btn1.onclick= ()=> game.keToko();
btn2.onclick= ()=> game.keGoa();
btn3.onclick= ()=> game.lawanNaga();
