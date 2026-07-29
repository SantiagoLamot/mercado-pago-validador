# Etapa de build (Maven + Java 21)
FROM maven:3.9-eclipse-temurin-21 AS build
WORKDIR /app

# Cacheo de dependencias
COPY pom.xml .
RUN mvn -q -DskipTests dependency:go-offline

# Código y build
COPY src ./src
RUN mvn -q -DskipTests package

# Etapa de runtime (Java 21 JRE)
FROM eclipse-temurin:21-jre-alpine AS production
RUN apk add --no-cache curl
WORKDIR /app
COPY --from=build /app/target/*.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java","-jar","app.jar"]

# Etapa de desarrollo (Maven + Java 21)
# Hot reload: spring-boot-devtools reinicia la app cuando cambian las clases
# compiladas. La recompilacion se dispara por POLLING (no inotify): en bind
# mounts de Docker Desktop sobre Windows los eventos de filesystem no siempre
# se propagan al contenedor, asi que un chequeo cada 2s por mtime es lo que
# funciona de forma confiable ahi.
FROM maven:3.9-eclipse-temurin-21 AS dev
WORKDIR /app

COPY pom.xml .
RUN mvn -q -DskipTests dependency:go-offline

COPY src ./src
EXPOSE 8080

CMD mvn -q spring-boot:run & \
    touch /tmp/.last-compile && \
    while true; do \
      sleep 2; \
      if [ -n "$(find ./src -newer /tmp/.last-compile -type f)" ]; then \
        touch /tmp/.last-compile && mvn -q compile; \
      fi; \
    done
