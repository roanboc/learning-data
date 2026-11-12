/* A mandate, written and enforced: Latin American Spanish captions, over the English film. Each English narration line (the key, exactly as in src/narration.js) maps to its caption.
   Only the captions change: the picture, the voice and the timings stay English, so the site plays the same film, and the video, which has no captions on its picture, takes es.srt.
   The Spanish page loads this before the film; tools/captions.py (with FILM_LANG=es) writes captions/es.srt and es.vtt from it, and fails if a line has no caption.
   Words as in the series and the films before it: el agente de carga docente (Why Unity Catalog and Unity Gateway govern them, Five stages), los directores de Salud,
   Recursos Humanos for HR, los docentes, temporales for casual staff, este periodo for this term, una asignatura for a unit (Every change through review), Enfermería
   and Salud Pública; un mandato, la página, el mapa, un rol, un requisito, una etapa, su puerta for its gate, un interruptor for a switch, el deshacer for the undo,
   acotado for narrow and revocable; en pruebas for in test, producción, la compilación de la noche for the night build, una verificación for a check and una prueba
   for a test, un seed, un contrato, una definición, el dueño; un pull request, su rama, su esquema, su App, as the screen says, las reglas de push de GitHub, el flujo
   de trabajo and su tiempo límite, una entidad de servicio for a service principal (Agents on Databricks), los permisos for grants and rights, una ronda, el presupuesto,
   el informe, la revisión de accesos; un término de personal for a word about staff. Noor aprueba como segunda persona and da el sí para producción; a person libera,
   as Every change through review's lesson says. The seven lessons as each film's own Spanish says them where it has one (Five stages, A place on the map, Every change
   through review), and in these words for the others. The last line names the next series: Un colega que no es una persona. Numbers keep the picture's digits and
   comma (50,000; 64; 38), so a viewer reads the same number in the caption and on screen. */
window.CAPTIONS=Object.assign(window.CAPTIONS||{},{
"Today, at the university.":
"Hoy, en la universidad.",
"Every week, Anil Kurian's workload agent tells Health's heads of school how many teach in each school, and how many are casual.":
"Cada semana, el agente de carga docente de Anil Kurian dice a los directores de Salud cuántos enseñan por escuela y cuántos son temporales.",
"Each night, every change is built in test, on a copy of the data, before it can reach production.":
"Cada noche, todo cambio se compila en pruebas, sobre una copia de los datos, antes de poder llegar a producción.",
"Last night, soon after eleven, that build failed in test, on the numbers the agent answers from.":
"Anoche, poco después de las once, esa compilación falló en pruebas, en las cifras con que responde el agente.",
"Nobody was at work. Finding out why is the agent's job.":
"No había nadie trabajando. Averiguar por qué es tarea del agente.",
"But an agent that works alone can do harm alone.":
"Pero un agente que trabaja solo puede hacer daño solo.",
"One night in October, to make a failed build pass, it also changed HR's model of contracts, which other teams' numbers come from.":
"Una noche de octubre, para salvar una compilación, cambió además el modelo de contratos de Recursos Humanos, del que dependen otros equipos.",
"Had that reached production, their numbers would have changed overnight, and nobody would have known why.":
"Si eso hubiera llegado a producción, sus cifras habrían cambiado de un día para otro, y nadie habría sabido por qué.",
"And what it might do alone was written nowhere: no one place to sign it, read it or stop it.":
"Y lo que podía hacer solo no estaba escrito en ninguna parte: ningún lugar donde firmarlo, leerlo o detenerlo.",
"An agent working alone needed its limits written down, in one place anyone could read.":
"Un agente que trabaja solo necesitaba sus límites por escrito, en un lugar que cualquiera pudiera leer.",
"So Anil wrote its mandate: one page, saying the one task it may do alone.":
"Así que Anil escribió su mandato: una página, que dice la única tarea que puede hacer solo.",
"Its task, and where. Its folders, and its checks.":
"Su tarea, y dónde. Sus carpetas, y sus verificaciones.",
"Ten rounds, one hour, a set budget.":
"Diez rondas, una hora, un presupuesto fijo.",
"A switch that stops it, and a way to undo each change.":
"Un interruptor que lo detiene, y una forma de deshacer cada cambio.",
"The page is on the map, beside the task it covers.":
"La página está en el mapa, junto a la tarea que cubre.",
"Anil signed it on 30 October, and Noor approved it, as a second person.":
"Anil lo firmó el 30 de octubre, y Noor lo aprobó, como segunda persona.",
"And each line is written into the tools that hold it.":
"Y cada línea está escrita en las herramientas que la hacen cumplir.",
"Last night, a plain check saw the copy had arrived, and the agent started.":
"Anoche, una verificación simple vio que la copia había llegado, y el agente empezó.",
"In three rounds it found why: the day's change read every version HR keeps of a contract.":
"En tres rondas halló por qué: el cambio del día leía cada versión que Recursos Humanos guarda de un contrato.",
"Three tutors had moved to another unit this term, so each of them counted twice.":
"Tres tutores se habían pasado a otra asignatura este periodo, así que cada uno se contó dos veces.",
"It fixed one line of its own dbt model, checked it in test, and touched nothing else.":
"Corrigió una línea de su propio modelo de dbt, la verificó en pruebas, y no tocó nada más.",
"Twenty minutes after the failure, its report was waiting for Anil.":
"Veinte minutos después de la falla, su informe esperaba a Anil.",
"Production never saw the bug: it gets only what passes its night in test, and a person's yes.":
"Producción nunca vio el error: solo recibe lo que pasa su noche en pruebas, y el sí de una persona.",
"And for data: an agent works alone only where its autonomy is written down, held in every tool, and can be taken back.":
"Y para los datos: un agente trabaja solo únicamente donde su autonomía está escrita, la hace cumplir cada herramienta y se puede retirar.",
"On the map, the workload agent is assigned to its role, with its stage beside each kind of task.":
"En el mapa, el agente de carga docente está asignado a su rol, con su etapa junto a cada tipo de tarea.",
"Beside the night task, at stage five, is one more line: its mandate.":
"Junto a la tarea de la noche, en la etapa cinco, hay una línea más: su mandato.",
"The mandate itself is a requirement, kept with the project's governance.":
"El mandato en sí es un requisito, guardado con la gobernanza del proyecto.",
"In test: find why the night build failed. If the cause is in its own models, fix it on its own branch, in its own schema.":
"En pruebas: hallar por qué falló la compilación de la noche. Si la causa está en sus modelos, corregirla en su propia rama y su esquema.",
"Then open a pull request, and report by six.":
"Luego abrir un pull request, e informar antes de las seis.",
"If the cause is anywhere else, tell that part's owner, and change nothing.":
"Si la causa está en otra parte, avisar al dueño de esa parte, y no cambiar nada.",
"In production: read, find the cause, and draft the fix. Never rerun: a plain job does that.":
"En producción: leer, hallar la causa y redactar la corrección. Nunca volver a ejecutar: eso lo hace un proceso simple.",
"Everywhere: never change a test, a seed, a contract or a definition. A question of meaning goes to its owner.":
"En todas partes: nunca cambiar una prueba, un seed, un contrato ni una definición. Una pregunta de significado va a su dueño.",
"Before it starts, a plain check: has tonight's copy arrived? If not, nothing starts, and Sam is told.":
"Antes de empezar, una verificación simple: ¿llegó la copia de esta noche? Si no, nada empieza, y se le avisa a Sam.",
"The same error twice: it stops and reports.":
"El mismo error dos veces: se detiene e informa.",
"Signing it was the last step of its gate to stage five, after fourteen nights in test without a miss.":
"Firmarlo fue el último paso de su puerta a la etapa cinco, tras catorce noches en pruebas sin un fallo.",
"Europe's AI law asks this of what it counts as high-risk: people who can understand it, watch it, reverse it and stop it.":
"La ley de IA de Europa pide esto a lo que considera de alto riesgo: personas que puedan entenderlo, vigilarlo, revertirlo y detenerlo.",
"But regulation usually moves more slowly than technology.":
"Pero la regulación suele avanzar más despacio que la tecnología.",
"So take more care than the law asks, most of all in critical systems.":
"Así que ten más cuidado del que pide la ley, sobre todo en los sistemas críticos.",
"The mandate covers one kind of task. On what a word about staff means, the same agent only suggests.":
"El mandato cubre un tipo de tarea. En lo que significa un término de personal, el mismo agente solo sugiere.",
"A page is only words. So each line is written into the tools from the map, as every right is.":
"Una página son solo palabras. Así que cada línea se escribe en las herramientas desde el mapa, como todo permiso.",
"Where it may write lives in Unity Catalog's grants: in test, only its own schema; in production, nowhere.":
"Dónde puede escribir está en los permisos de Unity Catalog: en pruebas, solo su propio esquema; en producción, en ninguna parte.",
"Its folders live in GitHub's push rules: its App can't push a change anywhere else.":
"Sus carpetas están en las reglas de push de GitHub: su App no puede subir un cambio a ningún otro lugar.",
"The hour is the workflow's own timeout: at sixty minutes, GitHub cancels the job.":
"La hora es el tiempo límite del propio flujo de trabajo: a los sesenta minutos, GitHub cancela el trabajo.",
"Its rounds are counted by the plain code that runs it, not by the model.":
"Sus rondas las cuenta el código simple que lo ejecuta, no el modelo.",
"Its budget is a limit in Unity Gateway on its own name: 50,000 tokens a minute. With the hour, that caps a night's cost.":
"Su presupuesto es un límite en Unity Gateway a su propio nombre: 50,000 tokens por minuto. Con la hora, acota el costo de una noche.",
"The plain check is the workflow's first step.":
"La verificación simple es el primer paso del flujo de trabajo.",
"And the project checks the page against those places: if a grant, a rule or a limit allows more, the check fails before anything merges.":
"Y el proyecto coteja la página con esos lugares: si un permiso, regla o límite permite más, la verificación falla antes de fusionar nada.",
"Nothing the agent reads can widen it, and neither can the agent: the page lives where its App can't push.":
"Nada de lo que el agente lee puede ampliarlo, ni tampoco el agente: la página vive donde su App no puede hacer push.",
"Last night, the agent found two things wrong with the same count.":
"Anoche, el agente encontró dos cosas mal en el mismo conteo.",
"The first was a bug. The rule is written: each contract counts once, as it stands today. The code counted every version.":
"La primera era un error. La regla está escrita: cada contrato cuenta una vez, como está hoy. El código contaba cada versión.",
"Putting that right is a fix the mandate lets it make, in test.":
"Corregir eso es un arreglo que el mandato le permite hacer, en pruebas.",
"The second it found while it looked: one of the three tutors moved from a Nursing unit to one in Public Health.":
"La segunda la encontró mientras buscaba: uno de los tres tutores pasó de una asignatura de Enfermería a una de Salud Pública.",
"Does that tutor count in both schools this term, or only in the one they teach in now? No rule says.":
"¿Ese tutor cuenta en ambas escuelas este periodo, o solo en la que enseña ahora? Ninguna regla lo dice.",
"That's not a bug: it's what a word about staff means, and HR decides it. The agent asked in its report, and changed nothing.":
"No es un error: es qué significa un término de personal, y lo decide Recursos Humanos. El agente preguntó en su informe, y no cambió nada.",
"An agent can't always tell the two apart, and at first, neither can a person.":
"Un agente no siempre distingue lo uno de lo otro, y al principio, tampoco una persona.",
"So in production, it only drafts: Jun reviews the code, a meaning goes to its owner, and Noor approves, as a second person.":
"Así que en producción solo redacta: Jun revisa el código, un significado va a su dueño, y Noor aprueba, como segunda persona.",
"In test, a wrong guess costs only a pull request nobody approves.":
"En pruebas, una mala conjetura cuesta solo un pull request que nadie aprueba.",
"And a night that only needs to run again needs no agent: a plain job does it.":
"Y una noche que solo necesita volver a ejecutarse no necesita un agente: lo hace un proceso simple.",
"Two lines more, shown here, not used.":
"Dos líneas más, mostradas aquí, sin usarse.",
"The switch: Sam deactivates its service principal, and suspends its App on GitHub.":
"El interruptor: Sam desactiva su entidad de servicio, y suspende su App en GitHub.",
"Then it can't sign in, and its grants stay, for when it's switched on again.":
"Entonces no puede iniciar sesión, y sus permisos se quedan, para cuando se vuelva a encender.",
"It can't reach the repository, and everyone else works on.":
"No puede llegar al repositorio, y todos los demás siguen trabajando.",
"Anil may stop it, and so may Sam, at any hour, without asking first.":
"Anil puede detenerlo, y Sam también, a cualquier hora, sin pedir permiso antes.",
"The undo: every change it proposes is a pull request, and a pull request can be reverted.":
"El deshacer: cada cambio que propone es un pull request, y un pull request se puede revertir.",
"And each table keeps its versions, with who wrote each one and when, so a person can restore the one before, by default for seven days.":
"Y cada tabla guarda sus versiones, con quién escribió cada una y cuándo: una persona puede restaurar la anterior, siete días por defecto.",
"The mandate itself can be taken back: Anil can narrow or withdraw it in a pull request, and the task waits for him again.":
"El mandato mismo se puede revocar: Anil puede acotarlo o retirarlo en un pull request, y la tarea vuelve a esperarlo a él.",
"Each December, it's read again, with the access review.":
"Cada diciembre se vuelve a leer, con la revisión de accesos.",
"Last night, nobody needed either.":
"Anoche, nadie necesitó ninguno de los dos.",
"Back at the university this morning, Anil read the report and its measures: three rounds, twenty minutes, well within its limits.":
"De vuelta en la universidad esta mañana, Anil leyó el informe y sus medidas: tres rondas, veinte minutos, muy dentro de sus límites.",
"Jun reviewed the fix and merged it. It ran in test again, and Noor said yes for production.":
"Jun revisó la corrección y la fusionó. Se ejecutó otra vez en pruebas, y Noor dio el sí para producción.",
"The question of the tutor who moved is with HR.":
"La pregunta del tutor que cambió de asignatura está con Recursos Humanos.",
"Nursing counts 64 teachers, 38 of them casual, and the agent decided nothing a person owns.":
"Enfermería cuenta 64 docentes, 38 de ellos temporales, y el agente no decidió nada que le corresponda a una persona.",
"This series began with five stages, not a switch.":
"Esta serie empezó con cinco etapas, no un interruptor.",
"Each stage changes whose identity the agent uses, how much it may do, and what the person does.":
"Cada etapa cambia qué identidad usa el agente, cuánto puede hacer, y qué hace la persona.",
"Each is written on the map, beside its kind of task, and each has its gate. The last is a mandate: written, narrow and revocable.":
"Cada una está escrita en el mapa, junto a su tipo de tarea, y tiene su puerta. La última es un mandato: escrito, acotado y revocable.",
"Seven films, seven lessons.":
"Siete películas, siete lecciones.",
"Autonomy is earned one kind of task at a time.":
"La autonomía se gana un tipo de tarea a la vez.",
"Borrowed rights are for learning, in a sandbox.":
"Los permisos prestados son para aprender, en un sandbox.",
"Before an agent works alone, it's architected like a colleague.":
"Antes de trabajar solo, un agente se integra a la arquitectura como un colega.",
"An agent's rights come from its work, not from a person's.":
"Los permisos de un agente vienen de su trabajo, no de los de una persona.",
"The map says what it may do; every tool holds it to that.":
"El mapa dice qué puede hacer; cada herramienta lo hace cumplir.",
"An agent proposes; a person releases.":
"Un agente propone; una persona libera.",
"Autonomy is a written, narrow, revocable mandate.":
"La autonomía es un mandato escrito, acotado y revocable.",
"This series is one more step on a longer road: from an agent that helps one person, to one that works beside the team.":
"Esta serie es un paso más en un camino más largo: de un agente que ayuda a una persona, a uno que trabaja junto al equipo.",
"Next: a colleague that isn't a person.":
"Después: un colega que no es una persona."});
