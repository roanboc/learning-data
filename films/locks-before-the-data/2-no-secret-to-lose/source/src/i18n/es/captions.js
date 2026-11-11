/* No secret to lose: Latin American Spanish captions, over the English film. Each English narration line (the key, exactly as in src/narration.js) maps to its caption.
   Only the captions change: the picture, the voice and the timings stay English, so the site plays the same film, and the video, which has no captions on its picture, takes es.srt.
   The Spanish page loads this before the film; tools/captions.py (with FILM_LANG=es) writes captions/es.srt and es.vtt from it, and fails if a line has no caption.
   Words: la City for the City of London; las letras del Tesoro and los certificados de depósito; el papel al portador for bearer paper; la bóveda for the Bank's vault
   and for a vault of secrets alike, as the film draws them alike; el proceso for the job and los datos del registro for the registrar's records, as the series says;
   entrar for signing in; el token, as the series keeps it; la clave for a key that signs, la llave de acceso for a passkey and la llave de seguridad for a security key;
   el peldaño for a rung; el pase for the short pass of the top two rungs; el servicio de compilación for the build service; el rol de carga for the loader role;
   and tú, as the film speaks to the viewer. */
window.CAPTIONS=Object.assign(window.CAPTIONS||{},{
"London, 2 May 1990.":
"Londres, 2 de mayo de 1990.",
"In the City, the money markets still run on paper.":
"En la City, los mercados de dinero aún funcionan con papel.",
"Treasury bills and certificates of deposit are promises to pay a set sum on a set day: the government's, and the banks'.":
"Las letras del Tesoro y los certificados de depósito son promesas de pagar una suma fija en un día fijo: del gobierno, y de los bancos.",
"When a bank sells one to another, a messenger walks it across the City, and comes back with the payment.":
"Cuando un banco le vende uno a otro, un mensajero lo lleva a pie por la City, y vuelve con el pago.",
"Much of that paper is made out to the bearer: whoever holds it can cash it.":
"Mucho de ese papel es al portador: quien lo tenga puede cobrarlo.",
"That morning, in a quiet street near the Bank of England, a man with a knife takes one messenger's case.":
"Esa mañana, en una calle tranquila cerca del Banco de Inglaterra, un hombre con un cuchillo le quita el maletín a un mensajero.",
"Inside are 301 bills and certificates, worth 292 million pounds.":
"Dentro hay 301 letras y certificados, por 292 millones de libras.",
"To whoever holds them now, they're as good as cash.":
"Para quien los tenga ahora, valen lo mismo que el efectivo.",
"If they're cashed before word of the theft gets round, the money is gone.":
"Si alguien los cobra antes de que se sepa del robo, el dinero se pierde.",
"And every messenger in the City carries that risk, every day.":
"Y cada mensajero de la City carga con ese riesgo, cada día.",
"The paper itself has to stop being worth stealing.":
"El papel mismo tiene que dejar de valer la pena robarlo.",
"The Bank of England has been building an answer since 1988.":
"El Banco de Inglaterra prepara una respuesta desde 1988.",
"On 1 October 1990, it opens the Central Moneymarkets Office.":
"El 1 de octubre de 1990, abre la Central Moneymarkets Office.",
"The paper goes into a vault at the Bank, and stays there.":
"El papel entra en una bóveda del Banco, y se queda allí.",
"Who owns each one is kept in the Bank's records.":
"Quién es dueño de cada uno consta en los registros del Banco.",
"A sale changes the record, once both sides have approved it.":
"Una venta cambia el registro, cuando las dos partes la han aprobado.",
"Forty-four banks and firms are in it from the first day.":
"Desde el primer día, están dentro cuarenta y cuatro bancos y empresas.",
"The Bank says why: to avoid the risk and the cost of moving paper around the City, as the theft in May had shown.":
"El Banco dice por qué: para evitar el riesgo y el costo de mover papel por la City, como había mostrado el robo de mayo.",
"Paper kept at the Bank stays off the streets, and no messenger carries it.":
"El papel guardado en el Banco no sale a la calle, y ningún mensajero lo lleva.",
"A password, a token or a key is bearer paper too: to whatever it opens, whoever holds it is you.":
"Una contraseña, un token o una clave también son papel al portador: ante lo que abren, quien los tenga eres tú.",
"At the university, a nightly job still carries one.":
"En la universidad, un proceso nocturno todavía lleva uno.",
"Like the Bank's records, the platform can know who the job is, so that nobody has to carry a secret at all.":
"Como los registros del Banco, la plataforma puede saber quién es el proceso, para que nadie tenga que llevar ningún secreto.",
"Every night at two, a job loads the registrar's records onto the university's data platform.":
"Cada noche a las dos, un proceso carga los datos del registro en la plataforma de datos de la universidad.",
"Sam Okafor, who runs the platform, has given it an identity of its own: registrar-loader.":
"Sam Okafor, que lleva la plataforma, le ha dado una identidad propia: registrar-loader.",
"But it still signs in the old way, with Jun Park's personal token.":
"Pero todavía entra a la manera antigua, con el token personal de Jun Park.",
"Jun made it on 14 March 2024, to get the job running, and it has no end date.":
"Jun lo creó el 14 de marzo de 2024, para poner en marcha el proceso, y no tiene fecha de fin.",
"To the platform, whoever holds that token is Jun.":
"Para la plataforma, quien tenga ese token es Jun.",
"They can read what Jun can read, from anywhere, at any hour, for as long as nobody notices.":
"Puede leer lo que Jun puede leer, desde cualquier lugar, a cualquier hora, mientras nadie lo note.",
"And it isn't in one place.":
"Y no está en un solo lugar.",
"Sam finds it in the job's settings, in an old notebook, and in a file on Jun's laptop.":
"Sam lo encuentra en la configuración del proceso, en un notebook viejo, y en un archivo en la laptop de Jun.",
"Every copy works as well as the first, and nobody can say how many there are.":
"Cada copia funciona tan bien como la primera, y nadie puede decir cuántas hay.",
"When Jun moves to another team, the job will stop, or go on with whatever Jun may do there.":
"Cuando Jun pase a otro equipo, el proceso se detendrá, o seguirá con lo que Jun pueda hacer allí.",
"Nobody did anything wrong: it was the quickest way to start, and it has worked for more than two and a half years.":
"Nadie hizo nada mal: era la forma más rápida de empezar, y ha funcionado durante más de dos años y medio.",
"But every night, the job carries bearer paper through the streets.":
"Pero cada noche, el proceso lleva papel al portador por las calles.",
"To sign in, the job has to prove it's the job.":
"Para entrar, el proceso tiene que probar que es el proceso.",
"Sam lays out the ways it can, from worst to best, with one question: who holds a secret, and for how long?":
"Sam ordena las formas de hacerlo, de peor a mejor, con una pregunta: ¿quién guarda un secreto, y por cuánto tiempo?",
"At the bottom, a person's token, or a shared account's password.":
"Abajo del todo, el token de una persona, o la contraseña de una cuenta compartida.",
"The job runs as someone else, with everything they may do.":
"El proceso actúa como otra persona, con todo lo que ella puede hacer.",
"One up, a token of the job's own.":
"Un peldaño más arriba, un token propio del proceso.",
"Only its own rights now, but still bearer paper, often with no end date.":
"Ahora solo con sus propios permisos, pero aún papel al portador, a menudo sin fecha de fin.",
"Then a secret in a vault, which the job reads as it starts, and a machine changes every month.":
"Luego, un secreto en una bóveda, que el proceso lee al arrancar, y que una máquina cambia cada mes.",
"Nobody types it, but while it's valid, a copy still works.":
"Nadie lo escribe, pero mientras es válido, una copia sigue funcionando.",
"Then a certificate: a key the job keeps, and never sends.":
"Luego, un certificado: una clave que el proceso guarda, y nunca envía.",
"It proves who it is by signing, so the key itself never crosses the wire.":
"Prueba quién es firmando, así que la clave misma nunca viaja por la red.",
"But the key is still kept somewhere, and must be renewed before it ends.":
"Pero la clave sigue guardada en algún sitio, y hay que renovarla antes de que venza.",
"Near the top, a note from where the job runs.":
"Cerca de la cima, una nota del lugar donde corre el proceso.",
"That place signs a short note, this job, from here, now, and the platform, which trusts the signer, lets it in for that run.":
"Ese lugar firma una nota breve, este proceso, desde aquí, ahora, y la plataforma, que confía en el firmante, lo deja entrar esa vez.",
"At the top, an identity the platform gives the job.":
"En la cima, una identidad que la plataforma le da al proceso.",
"The job runs on the platform's own machines, so the platform knows which job it is, and vouches for it.":
"El proceso corre en las máquinas de la propia plataforma, así que la plataforma sabe qué proceso es, y responde por él.",
"On these two rungs there are still passes, but the platform makes a new one for each run, nobody sees it, and it ends within the hour.":
"En estos dos peldaños aún hay pases, pero la plataforma crea uno nuevo en cada ejecución, nadie lo ve, y vence antes de una hora.",
"That's the goal: nobody makes, keeps, copies or changes a secret.":
"Esa es la meta: nadie crea, guarda, copia ni cambia un secreto.",
"Sam moves the nightly job up.":
"Sam sube el proceso nocturno.",
"On the platform, it now runs as registrar-loader, and the platform vouches for it.":
"En la plataforma, ahora corre como registrar-loader, y la plataforma responde por él.",
"Its rights are the loader role's, decided when it got its name, before it ever signed in.":
"Sus permisos son los del rol de carga, decididos cuando recibió su nombre, antes de entrar por primera vez.",
"Its code reaches the platform from the build service, which signs a note for each run, so no secret is stored there either.":
"Su código llega a la plataforma desde el servicio de compilación, que firma una nota en cada ejecución: tampoco allí se guarda un secreto.",
"Then Jun ends his token.":
"Luego Jun anula su token.",
"The copies in the settings, the notebook and the laptop are worthless paper now.":
"Las copias en la configuración, el notebook y la laptop ya son papel sin valor.",
"Sam asks what a thief would find tonight.":
"Sam se pregunta qué encontraría un ladrón esta noche.",
"Before: Jun's token, everything Jun can read, from anywhere, with no end date.":
"Antes: el token de Jun, todo lo que Jun puede leer, desde cualquier lugar, sin fecha de fin.",
"Now: a pass with one job's rights, that nobody stored, and that ends within the hour.":
"Ahora: un pase con los permisos de un solo proceso, que nadie guardó, y que vence antes de una hora.",
"And when Jun moves team, nothing breaks: the job was never his.":
"Y cuando Jun cambie de equipo, nada se rompe: el proceso nunca fue suyo.",
"Where a system can't climb yet, such as one that only takes a password, the password goes in a vault.":
"Donde un sistema aún no puede subir, como uno que solo acepta una contraseña, la contraseña va a una bóveda.",
"A machine changes it, and the exception is written down, with its owner.":
"Una máquina la cambia, y la excepción queda por escrito, con su responsable.",
"Every new job starts at the top.":
"Cada proceso nuevo empieza en la cima.",
"People sign in too, and their ladder is much the same.":
"Las personas también entran, y su escalera es muy parecida.",
"At the bottom, a shared account: nobody can tell who did what, and nobody can leave without changing it for everyone.":
"Abajo del todo, una cuenta compartida: nadie sabe quién hizo qué, y nadie puede irse sin cambiarla para todos.",
"A password alone can be guessed, used again on other sites, or typed into a fake page.":
"Una contraseña sola se puede adivinar, reusar en otros sitios, o escribir en una página falsa.",
"A code by text message is better, but a phone number can be moved to a thief's phone, and the code typed into a fake page too.":
"Un código por SMS es mejor, pero un número se puede pasar al teléfono de un ladrón, y el código también se escribe en una página falsa.",
"An app on your own phone is harder to steal, but a convincing fake page can still pass on your code, or get your yes.":
"Una app en tu propio teléfono es más difícil de robar, pero una página falsa convincente aún puede pasar tu código, o lograr tu sí.",
"At the top, a passkey, or a security key you plug in.":
"En la cima, una llave de acceso, o una llave de seguridad que conectas.",
"It's a key that stays on your device.":
"Es una clave que se queda en tu dispositivo.",
"You unlock it with your face, your fingerprint or a PIN, and those never leave it either.":
"La desbloqueas con tu cara, tu huella o un PIN, y esos tampoco salen nunca de él.",
"It answers only the real site, so a fake page gets nothing.":
"Solo responde al sitio real, así que una página falsa no obtiene nada.",
"And the platform keeps only the matching half, which opens nothing on its own.":
"Y la plataforma guarda solo la mitad que corresponde, que por sí sola no abre nada.",
"Nothing to remember, and nothing to type.":
"Nada que recordar, y nada que escribir.",
"At the university, everyone signs in once, with a passkey: Sam, Jun, and Mei Tanaka, who owns the registrar's data.":
"En la universidad, todos entran una vez, con una llave de acceso: Sam, Jun, y Mei Tanaka, dueña de los datos del registro.",
"Agents climb the job's ladder too: each signs in as itself, never on a person's token.":
"Los agentes también suben la escalera de los procesos: cada uno entra como sí mismo, nunca con el token de una persona.",
"In 1990, the City's paper stopped travelling, because the Bank kept the record of who owned what.":
"En 1990, el papel de la City dejó de viajar, porque el Banco llevaba el registro de quién era dueño de qué.",
"The nightly job stopped carrying a secret, because the platform knows who it is.":
"El proceso nocturno dejó de llevar un secreto, porque la plataforma sabe quién es.",
"There's nothing to leak, nothing to change on a schedule, and nothing that breaks when someone moves on.":
"No hay nada que filtrar, nada que cambiar por calendario, y nada que se rompa cuando alguien se va.",
"The best secret is the one nobody holds.":
"El mejor secreto es el que nadie guarda."
});
