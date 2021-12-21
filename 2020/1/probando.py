contador = 0
f = open("resultados", "r")
w = open("output", "w")

primera = True
for milinea in f :
    #por cada elemento en f print elemento (no hace falta definir en for)
    contador = contador + 1
    if primera:
    # if primera = True
        numero = int(milinea)
        primera = False
    if contador > 1:
        countador = str(contador-1)
    if "P P\n" == milinea:
        w.write("Case#"+ countador + ":-\n")
    if "R R\n" == milinea:
        w.write("Case#"+ countador + ":-\n")
    if "S S\n" == milinea:
        w.write("Case#"+ countador + ":-\n")
    if "P R\n" == milinea:
        w.write("Case#"+ countador + ":P\n")
    if "R P\n" == milinea:
        w.write("Case#"+ countador + ":P\n")
    if "P S\n" == milinea:
        w.write("Case#"+ countador + ":S\n")
    if "S P\n" == milinea:
        w.write("Case#"+ countador + ":S\n")
    if "R S\n" == milinea:
        w.write("Case#"+ countador + ":R\n")
    if "S R\n" == milinea:
        w.write("Case#"+ countador + ":R\n")
    if contador > numero:
        break
f.close()

