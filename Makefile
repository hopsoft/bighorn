all: max min

max:
	webpack

min:
	UGLIFY=true webpack
