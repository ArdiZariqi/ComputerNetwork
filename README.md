# Rrjeta Kompjuterike

Krjimi i një serveri dhe një klienti me NodeJs ku 4 apo më shumë pajisje të kycura në një rrjet UDP mund të komunikojnë me anë të sockets.

# Serveri
1.Të vendosen variabla të cilat përmbajnë numrin e portit (numri i portit të jetë i çfarëdoshëm) dhe IP adresën;

2.Të jetë në gjendje të dëgjojë (listen) të paktën të gjithë anëtaret e grupit;

3.Të pranojë kërkesat e pajisjeve që dërgojnë request (ku secili anëtarë i grupit duhet të e ekzekutojë të paktën një kërkesë në server);

4.Të jetë në gjendje të lexojë mesazhet që dërgohen nga klientët;

5.Të jetë në gjendje të jap qasje të plotë të paktën njërit klient për qasje ne folderat/ përmbajtjen në file-t në server.



# Klienti
1.Të krijohet socket lidhja me server;

2.Njëri nga pajisjet (klientët) të ketë privilegjet write(), read(), execute();

3.Klientët tjerë të kenë vetëm read() permission;

4.Të bëhet lidhja me serverin duke përcaktuar sakt portin dhe IP Adresën e serverit;

5.Të definohen saktë socket e serverit dhe lidhja të mos dështojë;

6.Të jetë në gjendje të lexojë përgjigjet që i kthehen nga serveri;

7.Të dërgojë mesazh serverit si në formë tekstit;

8.Të ketë qasje të plotë në folderat/ përmbajtjen në server.

## Anëtarët e grupit:
* Anjeza Gashi
* Anjeza Sfishta
* Arbnore Qorraj
* Ardi Zariqi
