/* A reason to keep it: Latin American Spanish captions, over the English film. Each English narration line (the key, exactly as in src/narration.js) maps to its caption.
   Only the captions change: the picture, the voice and the timings stay English, so the site plays the same film, and the video, which has no captions on its picture, takes es.srt.
   The Spanish page loads this before the film; tools/captions.py (with FILM_LANG=es) writes captions/es.srt and es.vtt from it, and fails if a line has no caption.
   Words as in the module's pages and the earlier films: RR. HH., la nómina, el periodo lectivo, la asignatura for a unit, Planificación, la gobernanza de datos,
   dueña de los datos, tutora ocasional, el propósito (as in Solo para este propósito, the film the narration names). New here: un dato for a piece of personal
   data, las seis razones (ella aceptó, un contrato, una ley, una misión pública, la vida de alguien, un interés legítimo, as the GDPR's Spanish text names the last
   two), una revisión de privacidad for the short privacy check, una revisión más a fondo for the deeper one, filtrarse for getting out. Names on screen stay as
   they are: GDPR, Oregon's numbers (42, 108, 85, 36), T-26188, Ingrid Holm, Linh Nguyen, Mei, Clara Jensen. */
window.CAPTIONS=Object.assign(window.CAPTIONS||{},{
"Oregon, 1986.":
"Oregón, 1986.",
"A new blood test can tell people whether they have HIV, the virus that causes AIDS.":
"Una nueva prueba de sangre puede decirle a una persona si tiene el VIH, el virus que causa el sida.",
"The test needs two things: a sample, and a way to give each person their result.":
"La prueba necesita dos cosas: una muestra, y una forma de darle a cada persona su resultado.",
"Oregon's public clinics write down each person's name with the result, and keep both private.":
"Las clínicas públicas de Oregón anotan el nombre de cada persona con su resultado, y guardan ambos en privado.",
"But many of those most at risk stay away.":
"Pero muchos de los que corren más riesgo no van.",
"A private list is still a list of names.":
"Una lista privada sigue siendo una lista de nombres.",
"They fear a positive result, one that finds the virus, could get out with their name.":
"Temen que un resultado positivo, uno que encuentra el virus, se filtre con su nombre.",
"It could cost them their job, their home or their health insurance.":
"Podría costarles el trabajo, la casa o el seguro médico.",
"So people with the virus don't know it, and can't protect the people they love.":
"Así, personas con el virus no lo saben, y no pueden proteger a quienes aman.",
"People have to be able to get tested without fearing for their name.":
"La gente tiene que poder hacerse la prueba sin temer por su nombre.",
"In December 1986, Oregon's health officials let people choose: their name, or a number.":
"En diciembre de 1986, las autoridades de salud de Oregón dejan elegir: su nombre, o un número.",
"A number does all the test needs: it matches the sample to the person, so each can come back for their result.":
"Un número hace todo lo que la prueba necesita: une la muestra con la persona, para que cada una vuelva por su resultado.",
"In the four months after, the number of gay and bisexual men tested rose from 42 a month to 108.":
"En los cuatro meses siguientes, los hombres gays y bisexuales que se hicieron la prueba pasaron de 42 al mes a 108.",
"And in three and a half months, 85 people with the virus were found, against 36 before.":
"Y en tres meses y medio se encontraron 85 personas con el virus, frente a 36 antes.",
"They could look after their health, and protect the people they loved.":
"Pudieron cuidar su salud, y proteger a quienes amaban.",
"It's the same with data: every piece you hold about a person could get out.":
"Con los datos pasa lo mismo: cada dato que guardas sobre una persona podría filtrarse.",
"So ask what each piece is for, and keep only what that reason needs.":
"Así que pregunta para qué es cada dato, y guarda solo lo que esa razón necesita.",
"Then people trust you with what you need.":
"Así la gente te confía lo que necesitas.",

"Today, at the university, Ingrid Holm owns HR's data.":
"Hoy, en la universidad, Ingrid Holm es dueña de los datos de RR. HH.",
"This November, she's getting HR ready for next year's tutors.":
"Este noviembre, prepara RR. HH. para los tutores del año próximo.",
"Linh Nguyen has tutored here since 2023. Her last contract ends on the twentieth.":
"Linh Nguyen es tutora aquí desde 2023. Su último contrato termina el día veinte.",
"HR holds a record of her, as of every tutor, in many pieces.":
"RR. HH. guarda un registro de ella, como de cada tutor, hecho de muchos datos.",
"The university already writes down what its data is for, as For this purpose only showed.":
"La universidad ya anota para qué son sus datos, como mostró Solo para este propósito.",
"But a purpose can be written for anything.":
"Pero se puede escribir un propósito para cualquier cosa.",
"So Ingrid asks of each piece HR holds: what is it really for, and does that need it?":
"Así que Ingrid pregunta por cada dato de RR. HH.: ¿para qué es de verdad, y eso lo necesita?",
"A reason you can say is one you could tell Linh in a sentence.":
"Una razón que puedes decir es una que podrías contarle a Linh en una frase.",
"If HR can't say why it holds a piece, it shouldn't hold it.":
"Si RR. HH. no puede decir por qué guarda un dato, no debería guardarlo.",

"A purpose says what a piece is for. The law also asks what allows it.":
"Un propósito dice para qué es un dato. La ley también pregunta qué lo permite.",
"Europe's GDPR, the best-known privacy law, names six reasons, and many other laws name similar ones.":
"El GDPR de Europa, la ley de privacidad más conocida, nombra seis razones, y muchas otras leyes nombran razones parecidas.",
"She agreed.":
"Ella aceptó.",
"A contract with her.":
"Un contrato con ella.",
"A law that requires it.":
"Una ley que lo exige.",
"A public task, a duty to the public, such as teaching.":
"Una misión pública, un deber con el público, como enseñar.",
"To protect someone's life.":
"Proteger la vida de alguien.",
"Or a fair interest, weighed against hers.":
"O un interés legítimo, sopesado frente al de ella.",
"Agreeing is just one of the six.":
"Aceptar es solo una de las seis.",
"Linh's contracts, hours and bank details rest on a contract: HR employs her, and pays her.":
"Los contratos, las horas y los datos bancarios de Linh se basan en un contrato: RR. HH. la emplea, y le paga.",
"Her tax number and pay records rest on a law, and so does her date of birth, which payroll needs for her pension.":
"Su número fiscal y sus registros de pago se basan en una ley, y también su fecha de nacimiento, que nómina necesita para su pensión.",
"The tutors' mailing list rests on her yes: in 2023, she ticked “Send me news of tutoring work”.":
"La lista de correo de tutores se basa en su sí: en 2023 marcó “Quiero recibir noticias de trabajo de tutoría”.",
"Her student records are Mei's, kept for a public task: teaching her, and awarding her degrees.":
"Sus registros de estudiante son de Mei, guardados por una misión pública: enseñarle, y otorgarle sus títulos.",
"Two pieces have no reason at all: her marital status, and a photo.":
"Dos datos no tienen ninguna razón: su estado civil, y una foto.",
"Nothing HR does uses them.":
"Nada de lo que hace RR. HH. los usa.",

"They came from the form Linh filled in to apply, in 2023.":
"Vinieron del formulario que Linh llenó para postularse, en 2023.",
"Applying is a step toward a contract, so the form should ask only what choosing a tutor needs.":
"Postularse es un paso hacia un contrato, así que el formulario debería pedir solo lo que elegir a un tutor necesita.",
"But it asked for her marital status and a photo, which no step used.":
"Pero pidió su estado civil y una foto, que ningún paso usaba.",
"And it asked everyone who applied for their date of birth and bank details.":
"Y pidió a todos los que se postularon su fecha de nacimiento y sus datos bancarios.",
"Only payroll needs those, and only once a tutor is hired.":
"Solo nómina los necesita, y solo cuando se contrata a un tutor.",
"Every piece held is one more that could get out, or be used for something it shouldn't.":
"Cada dato guardado es uno más que podría filtrarse, o usarse para algo que no debe.",
"So Ingrid's new form drops the two.":
"El nuevo formulario de Ingrid quita esos dos.",
"Payroll's two come after the offer.":
"Los dos de nómina llegan después de la oferta.",
"And HR deletes the marital status and photos it already holds.":
"Y RR. HH. borra los estados civiles y las fotos que ya tiene.",
"Like the clinics in Oregon, it asks for what the reason needs, when it needs it, and nothing more.":
"Como las clínicas de Oregón, pide lo que la razón necesita, cuando lo necesita, y nada más.",

"The 2023 form also said: “I agree to the university using my personal data for HR purposes.”":
"El formulario de 2023 también decía: “Acepto que la universidad use mis datos personales para fines de RR. HH.”",
"It sounds careful, but it's the wrong reason.":
"Suena cuidadoso, pero es la razón equivocada.",
"If Linh had said no, HR would still have to keep her pay records: a law requires it.":
"Si Linh hubiera dicho que no, RR. HH. igual tendría que guardar sus registros de pago: una ley lo exige.",
"And it couldn't pay her without her bank details.":
"Y no podría pagarle sin sus datos bancarios.",
"A yes is a reason only where a no is a real choice.":
"Un sí es una razón solo donde un no es una opción real.",
"In Oregon, the choice was real: a name or a number, and the same test either way.":
"En Oregón, la opción era real: un nombre o un número, y la misma prueba en ambos casos.",
"So the new form says plainly what HR holds, why, and for how long.":
"El nuevo formulario dice claro qué guarda RR. HH., por qué y por cuánto tiempo.",
"And it asks one real question: “Send me news of tutoring work?”":
"Y hace una pregunta real: “¿Quieres recibir noticias de trabajo de tutoría?”",
"Say no, and nothing else changes.":
"Di que no, y nada más cambia.",
"Linh's yes is kept on the person, with its date, beside her other wishes.":
"El sí de Linh se guarda en su registro, con su fecha, junto a sus otras preferencias.",
"The list is built each semester from those yeses, and when she says no, it leaves her out.":
"La lista se arma cada semestre con esos síes, y cuando ella diga que no, la deja fuera.",

"Then Clara Jensen, in Planning, asks HR for the tutors' records, to plan next year's tutoring.":
"Luego Clara Jensen, de Planificación, pide a RR. HH. los registros de tutores, para planear las tutorías del año próximo.",
"It's a new use: HR holds them to employ and pay tutors, not to plan.":
"Es un uso nuevo: RR. HH. los guarda para emplear y pagar tutores, no para planear.",
"So before anything is shared, a short privacy check.":
"Así que antes de compartir nada, una breve revisión de privacidad.",
"What is it for? Does it fit why the data is held?":
"¿Para qué es? ¿Encaja con el motivo de guardar los datos?",
"What's the least it needs? Which reason allows it?":
"¿Qué es lo mínimo que necesita? ¿Qué razón lo permite?",
"What could go wrong, and for whom? And who decides?":
"¿Qué podría salir mal, y para quién? ¿Y quién decide?",
"Clara needs hours by unit and teaching period: no names, no pay, no bank details.":
"Clara necesita horas por asignatura y periodo lectivo: sin nombres, sin sueldos, sin datos bancarios.",
"A unit with one tutor would show her hours, so small units are counted together.":
"Una asignatura con un solo tutor mostraría sus horas, así que las asignaturas pequeñas se cuentan juntas.",
"Ingrid, who owns the data, signs yes until the plan is set, and data governance keeps the check.":
"Ingrid, dueña de los datos, firma que sí hasta que el plan esté listo, y la gobernanza de datos guarda la revisión.",
"In Oregon, the counts that showed the change worked held no names. Clara's plan needs none either.":
"En Oregón, los conteos que mostraron que el cambio funcionó no tenían nombres. El plan de Clara tampoco los necesita.",
"A use that decides something about a person, such as who's hired again, gets a deeper check, which asks the people it's about.":
"Un uso que decide algo sobre alguien, como a quién recontratar, pasa una revisión más a fondo, que consulta a esas personas.",

"On the twentieth, Linh's contract ends.":
"El día veinte termina el contrato de Linh.",
"Every piece HR holds about her has a reason it can say.":
"Cada dato que RR. HH. guarda sobre ella tiene una razón que puede decir.",
"How long each is kept, and why, comes next.":
"Cuánto se guarda cada uno, y por qué, viene después.",
"When she asks what the university holds about her, Ingrid can answer: what, and why.":
"Cuando pregunte qué guarda la universidad sobre ella, Ingrid podrá responder: qué, y por qué.",
"In Oregon, the clinics asked what the test really needed. A number was enough, and people came.":
"En Oregón, las clínicas se preguntaron qué necesitaba de verdad la prueba. Un número bastó, y la gente fue.",
"Keep data for a reason you can say.":
"Guarda los datos por una razón que puedas decir.",
"Then people can trust you with what you need, and what you don't hold can never be used against them.":
"Así la gente puede confiarte lo que necesitas, y lo que no guardas nunca podrá usarse en su contra."
});
