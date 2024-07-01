# Utilisez Ubuntu 22.04 comme base
FROM ubuntu:22.04

ARG DEBIAN_FRONTEND=noninteractive

# Installer les dépendances de base
RUN \
    apt-get update && \
    apt-get dist-upgrade -y && \
    apt-get install -y --no-install-recommends \
        ca-certificates \
        libatk1.0-0 \
        libatk-bridge2.0-0 \
        libatk-adaptor \
        libatspi2.0-0 \
        libunwind8 \
        libdw1 \
        libgmp10 \
        libgsl27 \
        libglib2.0-0 \
        libcap2 \
        libcups2 \
        liborc-0.4-0 \
        iso-codes \
        libgl1 \
        libgles1 \
        libgles2 \
        libgudev-1.0-0 \
        libgbm1 \
        libgraphene-1.0-dev \
        libpng16-16 \
        libjpeg8 \
        libogg0 \
        libopus0 \
        libpango-1.0-0 \
        libvisual-0.4-0 \
        libtheora0 \
        libvorbis0a \
        libxkbcommon0 \
        libxcomposite1 \
        libxdamage1 \
        libwayland-client0 \
        libwayland-cursor0 \
        libwayland-egl1 \
        libwayland-server0 \
        libharfbuzz-icu0 \
        libegl1 \
        libepoxy0 \
        libgcrypt20 \
        libwebp7 \
        libwebpdemux2 \
        libwebpmux3 \
        libopenjp2-7 \
        libwoff1 \
        libxslt1.1 \
        bubblewrap \
        libseccomp2 \
        xdg-dbus-proxy \
        libsoup2.4-1 \
        libvulkan1 \
        libass9 \
        libchromaprint1 \
        libcurl3-gnutls \
        libaom3 \
        libbz2-1.0 \
        liblcms2-2 \
        libbs2b0 \
        libdca0 \
        libfaac0 \
        libfaad2 \
        libflite1 \
        libssl3 \
        ladspa-sdk \
        libfdk-aac2 \
        libgsm1 \
        libkate1 \
        libgme0 \
        libde265-0 \
        liblilv-0-0 \
        libmodplug1 \
        mjpegtools \
        libmjpegutils-2.1-0 \
        libmpcdec6 \
        libdvdnav4 \
        libdvdread8 \
        librsvg2-2 \
        librtmp1 \
        libsbc1 \
        libsndfile1 \
        libsoundtouch1 \
        libspandsp2 \
        libsrt1.4-openssl \
        libsrtp2-1 \
        libvo-aacenc0 \
        libvo-amrwbenc0 \
        libwebrtc-audio-processing1 \
        libofa0 \
        libzvbi0 \
        libopenexr25 \
        libwildmidi2 \
        libx265-199 \
        libzbar0 \
        wayland-protocols \
        libaa1 \
        libmp3lame0 \
        libcaca0 \
        libdv4 \
        libmpg123-0 \
        libvpx7 \
        libshout3 \
        libspeex1 \
        libtag1v5 \
        libtwolame0 \
        libwavpack1 \
        liba52-0.7.4 \
        libx264-163 \
        libopencore-amrnb0 \
        libopencore-amrwb0 \
        libmpeg2-4 \
        libavcodec58 \
        libavfilter7 \
        libavformat58 \
        libavutil56 \
        libva2 \
        libva-wayland2 \
        xvfb \
        libxrandr-dev \
        glibc-tools

# Copier le script pour les dépendances spécifiques
COPY docker/install-arch-specific-dependencies.sh /.install-deps.sh
RUN /.install-deps.sh

# Ajouter le groupe 'render'
RUN \
    rm -f /.install-deps.sh && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/* && \
    groupadd -f -g 110 render

# Mettre à jour et installer des dépendances supplémentaires
RUN apt-get update && apt-get install -y --no-install-recommends \
    curl \
    ca-certificates \
    fonts-dejavu-core \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# Installer Node.js 20
RUN curl -fsSL https://deb.nodesource.com/setup_20.x | bash - \
    && apt-get update \
    && apt-get install -y nodejs \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# Installer pnpm
RUN npm install -g pnpm