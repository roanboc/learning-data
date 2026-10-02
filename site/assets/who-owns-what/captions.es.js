/* Who owns what: Latin American Spanish captions, over the English film. Each English narration line (the key, exactly as in src/narration.js) maps to its caption.
   Only the captions change: the picture, the voice and the timings stay English, so the site plays the same film, and the video, which has no captions on its picture, takes es.srt.
   The Spanish page loads this before the film; tools/captions.py (with FILM_LANG=es) writes captions/es.srt and es.vtt from it, and fails if a line has no caption. */
window.CAPTIONS=Object.assign(window.CAPTIONS||{},{
"Before 1858, buying land in South Australia meant tracing a chain of old deeds, and hoping none was missing.":
"Antes de 1858, comprar tierra en Australia del Sur exigía rastrear una cadena de escrituras antiguas, y esperar que no faltara ninguna.",
"That year, a law promoted by Robert Torrens made the government's register the title.":
"Ese año, una ley impulsada por Robert Torrens hizo del registro del gobierno el título.",
"Anyone could rely on it, without checking its history.":
"Cualquiera podía confiar en él, sin revisar su historia.",
"Only a registered transfer, signed by the owner, could change it.":
"Solo una transferencia registrada, firmada por el dueño, podía cambiarlo.",
"The credential's core models work the same way. Their owner publishes them, everyone relies on them, and only their owner changes them.":
"Los modelos núcleo de la credencial funcionan igual. Su dueño los publica, todos confían en ellos, y solo su dueño los cambia.",
"Everything is green, in one project.":
"Todo está en verde, en un solo proyecto.",
"But its meaning has owners. The registrar's office, where Mei works, owns learners, awards and credentials, and the student IDs it issues.":
"Pero su significado tiene dueños. La oficina de registro, donde trabaja Mei, es dueña de estudiantes, títulos y credenciales, y de los ID de estudiante que emite.",
"The learning team owns two kinds of credential, microcredentials and badges, and the keys of its two platforms.":
"El equipo de aprendizaje es dueño de dos tipos de credencial, microcredenciales e insignias, y de las claves de sus dos plataformas.",
"Each is a domain: it owns the meaning of the facts it records.":
"Cada uno es un dominio: es dueño del significado de los hechos que registra.",
"Planning and the wallet app are domains too. They own what they build for themselves: their marts.":
"Planificación y la app de billetera también son dominios. Son dueños de lo que construyen para sí: sus marts.",
"In the project, models are gathered in groups, and each group names an owner. The staging, core and mart models also name their domain. Ownership follows meaning, not the code.":
"En el proyecto, los modelos se reúnen en grupos, y cada grupo nombra un dueño. Los modelos de staging, núcleo y marts también nombran su dominio. La propiedad sigue al significado, no al código.",
"So what does a domain publish? A core model, as a product.":
"Entonces, ¿qué publica un dominio? Un modelo núcleo, como producto.",
"Take the learner. Its YAML states its grain: one row per learner per version.":
"Tomemos al estudiante. Su YAML declara su granularidad: una fila por estudiante por versión.",
"Its owner: Mei, at the registrar's office. Its domain. And its glossary term: learner.":
"Su dueña: Mei, en la oficina de registro. Su dominio. Y su término del glosario: estudiante.",
"An enforced contract. A version number, so a change never arrives as a surprise. And its documentation.":
"Un contrato aplicado. Un número de versión, para que un cambio nunca llegue por sorpresa. Y su documentación.",
"Noor's group builds it. Mei owns what it means. Everyone else builds on it, not on how it was made.":
"El grupo de Noor lo construye. Mei es dueña de lo que significa. Todos los demás construyen sobre él, no sobre cómo se hizo.",
"Who can build on what? In dbt, that's access, and it comes in three rings.":
"¿Quién puede construir sobre qué? En dbt, eso es el acceso, y viene en tres anillos.",
"Two came with the contracts. Public, for the core: any project can build on it.":
"Dos llegaron con los contratos. Público, para el núcleo: cualquier proyecto puede construir sobre él.",
"Protected, for the marts: only this project.":
"Protegido, para los marts: solo este proyecto.",
"The third is private: only models in the same group. That's staging and intermediate.":
"El tercero es privado: solo modelos del mismo grupo. Eso es staging e intermedio.",
"The wallet team tries to build on an intermediate model. dbt refuses before anything runs, and says why.":
"El equipo de billetera intenta construir sobre un modelo intermedio. dbt lo rechaza antes de ejecutar nada, y dice por qué.",
"Then it builds on Planning's mart. dbt allows it: same project, and the mart is protected.":
"Luego construye sobre el mart de Planificación. dbt lo permite: mismo proyecto, y el mart es protegido.",
"It's still wrong. That mart is shaped for Planning, and changes when Planning needs it to. Consumers build on the core, not on each other's marts.":
"Sigue estando mal. Ese mart está hecho a la medida de Planificación, y cambia cuando Planificación lo necesita. Los consumidores construyen sobre el núcleo, no sobre los marts de otros.",
"Access decides which models can refer to a model. It doesn't decide who can read its table.":
"El acceso decide qué modelos pueden referirse a un modelo. No decide quién puede leer su tabla.",
"On Databricks, grants do that. Planning's marts grant reading to the groups Planning names.":
"En Databricks, eso lo deciden los permisos. Los marts de Planificación dan lectura a los grupos que ella nombra.",
"A dashboard can read a private staging table, if a grant lets it. Access doesn't stop it.":
"Un tablero puede leer una tabla privada de staging, si un permiso lo deja. El acceso no lo impide.",
"Referring and reading are two different doors, opened by two different rules.":
"Referirse y leer son dos puertas distintas, que abren dos reglas distintas.",
"Today, it's all one project. One day, Planning may own a project of its own.":
"Hoy, todo es un solo proyecto. Algún día, Planificación podría tener un proyecto propio.",
"Then it names the project it depends on: credentials.":
"Entonces nombra el proyecto del que depende: credentials.",
"And it refers to the core by project and by name, pinned to a version: the learner, version one.":
"Y se refiere al núcleo por proyecto y por nombre, fijado a una versión: el estudiante, versión uno.",
"Only public models cross. Planning can't reach the wallet's marts, or any step inside. The domains meet on the core.":
"Solo cruzan los modelos públicos. Planificación no alcanza los marts de la billetera, ni ningún paso interno. Los dominios se encuentran en el núcleo.",
"This part is a sketch. References across projects need dbt Cloud, so it doesn't run on DuckDB.":
"Esta parte es un boceto. Las referencias entre proyectos necesitan dbt Cloud, así que no corre en DuckDB.",
"Split into domains, some things must still be shared.":
"Divididos en dominios, algunas cosas aún deben compartirse.",
"The key sets: one per system, each with its owner.":
"Los conjuntos de claves: uno por sistema, cada uno con su dueño.",
"One macro for every hash. Aisha's student ID gives the same sixty-four characters, in every project.":
"Una macro para cada hash. El ID de estudiante de Aisha da los mismos sesenta y cuatro caracteres, en cada proyecto.",
"Hash it another way, in lower case, and she gets a second key. Joins find nothing, and no test fails.":
"Hazle el hash de otra forma, en minúsculas, y ella tiene otra clave. Los joins no hallan nada, y ninguna prueba falla.",
"The conventions and the glossary, too. Macros don't cross projects, so the shared ones would move to a package both install.":
"Las convenciones y el glosario, también. Las macros no cruzan proyectos, así que las compartidas pasarían a un paquete que ambos instalan.",
"Without shared keys, domains become silos.":
"Sin claves compartidas, los dominios se vuelven silos.",
"So why not split now? Every project is more to deploy, and more to keep in step.":
"Entonces, ¿por qué no dividir ahora? Cada proyecto es más que desplegar, y más que mantener al paso.",
"On the twelfth of October, Noor decided: groups first, in one project, while one team builds the core. Projects later, when teams own their domains.":
"El doce de octubre, Noor decidió: primero grupos, en un solo proyecto, mientras un equipo construye el núcleo. Proyectos después, cuando los equipos sean dueños de sus dominios.",
"Many owners, and many hands. One of them isn't a person.":
"Muchos dueños, y muchas manos. Una de ellas no es una persona."
});
