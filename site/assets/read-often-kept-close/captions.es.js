/* Read often, kept close: Latin American Spanish captions, over the English film. Each English narration line (the key, exactly as in src/narration.js) maps to its caption.
   Only the captions change: the picture, the voice and the timings stay English, so the site plays the same film, and the video, which has no captions on its picture, takes es.srt.
   Words as in the module's pages: nómina, el día de pago, el tutor ocasional, el registro de pago, bancos de germoplasma for gene banks, and the storage tiers named as the
   cloud names them, caliente, templado, frío and archivo (el nivel de archivo for the archive tier).
   The Spanish page loads this before the film; tools/captions.py (with FILM_LANG=es) writes captions/es.srt and es.vtt from it, and fails if a line has no caption. */
window.CAPTIONS=Object.assign(window.CAPTIONS||{},{
"February 2008. Deep in a frozen mountain on Svalbard, Norway's Arctic islands, a vault opens.":
"Febrero de 2008. Dentro de una montaña helada en Svalbard, islas árticas de Noruega, se abre una bóveda.",
"At minus eighteen degrees, it keeps copies of seeds from gene banks around the world.":
"A dieciocho grados bajo cero, guarda copias de semillas de bancos de germoplasma de todo el mundo.",
"Gene banks keep the seeds of crops and their wild relatives, so breeders can grow crops that stand drought and disease.":
"Guardan semillas de cultivos y sus parientes silvestres, para que los fitomejoradores logren cultivos que resistan sequía y enfermedad.",
"Near Aleppo, in Syria, a gene bank keeps 141,052 samples of wheat, barley, lentils and chickpeas, from the world's dry lands.":
"Cerca de Alepo, en Siria, un banco guarda 141,052 muestras de trigo, cebada, lentejas y garbanzos de las tierras secas del mundo.",
"From 2008, it sends copies of most of them to the vault.":
"Desde 2008, envía copias de la mayoría a la bóveda.",
"But a gene bank can be lost, to war, flood or a power cut, and a variety lost is lost for good.":
"Pero un banco puede perderse por guerra, inundación o un apagón, y una variedad perdida se pierde para siempre.",
"In 2012, war came close to Aleppo. Most of the bank's keepers had to leave, and it could no longer send seeds out.":
"En 2012, la guerra llegó cerca de Alepo. Casi todos los custodios del banco tuvieron que irse, y ya no pudo enviar semillas.",
"Breeders could no longer get the seeds they relied on, and every variety in the bank was at risk.":
"Los fitomejoradores ya no recibían las semillas de las que dependían, y cada variedad del banco corría peligro.",
"Unless the copies could come back, the collection would be lost for good.":
"Si las copias no volvían, la colección se perdería para siempre.",
"In 2015, the keepers did what no one had done before: they asked the vault for their copies.":
"En 2015, los custodios hicieron lo que nadie antes: le pidieron a la bóveda sus copias.",
"38,073 samples came out of the mountain, and that November they were sown in Lebanon and Morocco.":
"Salieron de la montaña 38,073 muestras, y ese noviembre se sembraron en el Líbano y en Marruecos.",
"By 2020, nothing was left of the collection in Aleppo.":
"Para 2020, no quedaba nada de la colección en Alepo.",
"Yet no more than 1,657 of its samples were lost, and breeders can order its seeds again.":
"Aun así, se perdieron a lo sumo 1,657 muestras, y los fitomejoradores vuelven a pedir sus semillas.",
"Seeds in use, kept close and ready; their copies, frozen far away, until the day they're needed.":
"Las semillas en uso, cerca y listas; sus copias, congeladas lejos, hasta el día en que se necesiten.",
"Data can be kept the same way.":
"Los datos pueden guardarse igual.",
"Until September, the university kept all its data in the same storage, whether it was read every day or once in seven years.":
"Hasta septiembre, la universidad guardaba todos sus datos en el mismo almacenamiento, se leyeran cada día o una vez en siete años.",
"Years of old pay records filled the costliest storage, and none was ever deleted: a cost, and a risk to everyone in them.":
"Años de registros de pago viejos llenaban el almacenamiento más caro, sin borrar ninguno: un costo, y un riesgo para quienes están en ellos.",
"Now where data is kept follows how often it's read.":
"Ahora, dónde se guardan los datos sigue a cuán seguido se leen.",
"In September, Noor asked each data owner a second question, after how fresh it must be: how often is it read?":
"En septiembre, Noor hizo a cada dueño de datos una segunda pregunta, tras cuán frescos deben estar: ¿cuán seguido se leen?",
"Cloud storage comes in tiers, named hot, cool, cold and archive, after how often data is read.":
"El almacenamiento en la nube viene en niveles, llamados caliente, templado, frío y archivo, según cuán seguido se leen los datos.",
"The names sound like data's temperature, but they answer another question: not when someone acts on it, but how often anyone reads it.":
"Los nombres suenan a la temperatura de los datos, pero responden otra pregunta: no cuándo alguien actúa, sino cuán seguido alguien los lee.",
"Each tier down costs less to keep, and more to read. The archive tier takes hours to bring a file back.":
"Cada nivel más abajo cuesta menos guardar y más leer. El nivel de archivo tarda horas en devolver un archivo.",
"So keep what's read often where reading is cheap, and what's rarely read where keeping is cheap.":
"Así que guarda lo que se lee seguido donde leer es barato, y lo que casi no se lee donde guardar es barato.",
"How long it's kept at all is set by the law and the business, and it goes into the data's contract.":
"Cuánto tiempo se guarda lo fijan la ley y el negocio, y queda en el contrato de los datos.",
"Every pay day, payroll sends the platform a record of each pay, with the hours each casual tutor worked.":
"Cada día de pago, nómina envía a la plataforma un registro de cada pago, con las horas que trabajó cada tutor ocasional.",
"Australian law asks employers to keep pay records for seven years, and after the first, they're rarely read.":
"La ley australiana pide a los empleadores guardar los registros de pago siete años, y después del primero casi no se leen.",
"Until September, every year's records sat in the hot tier, and none was ever deleted.":
"Hasta septiembre, los registros de cada año estaban en el nivel caliente, y nunca se borró ninguno.",
"Now, a year after it's written, each file moves to the archive tier, the cheapest to keep.":
"Ahora, un año después de escrito, cada archivo pasa al nivel de archivo, el más barato para guardar.",
"Like the copies on Svalbard, they sleep until someone needs them.":
"Como las copias de Svalbard, duermen hasta que alguien las necesita.",
"The table is told, so queries for recent pay still run, and one that needs an archived year says which files to bring back.":
"La tabla lo sabe: las consultas de pagos recientes siguen corriendo, y la que necesita un año archivado dice qué archivos recuperar.",
"Bringing them back takes hours, which is fine for an audit.":
"Recuperarlos toma horas, lo que está bien para una auditoría.",
"When a year's records turn seven, they're deleted, on a date set in advance, and their files removed for good.":
"Cuando los registros de un año cumplen siete, se borran en una fecha fijada de antemano, y sus archivos se eliminan para siempre.",
"In October, the oldest records, more than seven years old, were deleted.":
"En octubre se borraron los registros más antiguos, de más de siete años.",
"How to delete well is for the films on data protection.":
"Cómo borrar bien es tema de las películas sobre protección de datos.",
"One record moves down as it ages.":
"Un registro baja de nivel a medida que envejece.",
"Today, Linh's pay record is written. This year it's read often: for her payslip, a question, the year's end.":
"Hoy se escribe el registro de pago de Linh. Este año se lee seguido: para su recibo, una consulta, el cierre del año.",
"A year from now, its file moves to the archive tier, where keeping it costs a small part of what it did.":
"Dentro de un año, su archivo pasa al nivel de archivo, donde guardarlo cuesta una pequeña parte de lo que costaba.",
"If an audit asks for it, it comes back in hours.":
"Si una auditoría lo pide, vuelve en horas.",
"Seven years after her contract ends, it's deleted, and its files are removed for good.":
"Siete años después de que termina su contrato, se borra, y sus archivos se eliminan para siempre.",
"At each step, where it lives follows how often it's read.":
"En cada paso, dónde vive sigue a cuán seguido se lee.",
"On Svalbard, the vault stays cold and still. In Lebanon and Morocco, the bank sends out its seeds again.":
"En Svalbard, la bóveda sigue fría y quieta. En el Líbano y Marruecos, el banco vuelve a enviar sus semillas.",
"At the university, data is kept the same way: what's read often, where it's quick to read; old pay records, cheaply, until they're deleted.":
"En la universidad, los datos se guardan igual: lo que se lee seguido, donde leer es rápido; los pagos viejos, barato, hasta borrarse.",
"Today, a pay day, 2,960 new pay records are written, Linh's among them.":
"Hoy, día de pago, se escriben 2,960 registros de pago nuevos, entre ellos el de Linh.",
"How often data is read decides where it's kept; the law and the business decide for how long.":
"Cuán seguido se leen los datos decide dónde se guardan; la ley y el negocio, por cuánto tiempo.",
"Storage has had tiers for years: there's no wheel to reinvent.":
"El almacenamiento ya tiene niveles hace años: no hay rueda que reinventar.",
"Start from the official docs, then investigate, adapt, implement, iterate.":
"Empieza por la documentación oficial; luego investiga, adapta, implementa, itera.",
"Next: data as software, where scripts became software.":
"Siguiente: los datos como software, donde los scripts se volvieron software."
});
