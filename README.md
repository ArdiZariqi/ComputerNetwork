# Rrjeta Kompjuterike

Krjimi i nje serverit dhe nje klienti me NodeJs ku 4 pajisje te kycura ne nje rrjet UDP mund komunikojne me ane te sockets.

# Serveri
Të vendosen variabla te cilat përmbajnë numrin e portit (numri i portit të jetë i çfarëdoshëm) dhe IP adresën;
Të jetë në gjendje të dëgjojë (listen) të paktën të gjithë anëtaret e grupit;
Të pranojë kërkesat e pajisjeve që dërgojnë request (ku secili anëtarë i grupit duhet te e ekzekutoje të paktën një kërkesë në server);
Të jetë në gjendje të lexoje mesazhet që dërgohen nga klientët;
Të jetë në gjendje të jap qasje të plotë të paktën njërit klient për qasje ne folderat/ përmbajtjen në file-t në server.

# Klienti
Të krijohet socket lidhja me server;
Njeri nga pajisjet (klientët) të ketë privilegjet write(), read(), execute();
Klientët tjerë të kenë vetëm read() permission;
Të behet lidhja me serverin duke përcaktuar sakt portin dhe IP Adresën e serverit;
Të definohen sakte socket e serverit dhe lidhje të mos dështojë;
Të jetë në gjendje të lexojë përgjigjet që i kthehen nga serveri;
Të dërgojë mesazh serverit si në formë tekstit;
Të ketë qasje të plotë në folderat/ përmbajtjen në server.
