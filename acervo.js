(function () {
  'use strict';

  var PAGE_SIZE = 24;
  var ALL_YEARS = 'all';
  var rawPosts = Array.isArray(window.ACAO_POSTS) ? window.ACAO_POSTS : [];
  var posts = rawPosts.filter(function (post) {
    return post && typeof post === 'object';
  });
  var orderedPosts = posts.slice().sort(function (first, second) {
    var dateOrder = String(second.date || '').localeCompare(String(first.date || ''));
    if (dateOrder !== 0) {
      return dateOrder;
    }
    return String(second.code || '').localeCompare(String(first.code || ''));
  });

  var state = {
    query: '',
    year: ALL_YEARS,
    theme: '',
    visible: PAGE_SIZE,
    activePost: null,
    activeImage: 0,
    lastTrigger: null
  };

  var elements = {
    search: document.getElementById('post-search'),
    yearFilters: document.getElementById('year-filters'),
    themeFilter: document.getElementById('theme-filter'),
    resultCount: document.getElementById('result-count'),
    heroTotal: document.getElementById('hero-total'),
    clearFilters: document.getElementById('clear-filters'),
    emptyClear: document.getElementById('empty-clear'),
    emptyState: document.getElementById('empty-state'),
    grid: document.getElementById('posts-grid'),
    loadMore: document.getElementById('load-more'),
    loadStatus: document.getElementById('load-status'),
    dialog: document.getElementById('post-dialog'),
    dialogClose: document.getElementById('dialog-close'),
    dialogKicker: document.getElementById('dialog-kicker'),
    dialogDate: document.getElementById('dialog-date'),
    dialogTitle: document.getElementById('dialog-title'),
    dialogTags: document.getElementById('dialog-tags'),
    dialogSummary: document.getElementById('dialog-summary'),
    dialogSource: document.getElementById('dialog-source'),
    dialogImage: document.getElementById('dialog-image'),
    dialogNoImage: document.getElementById('dialog-no-image'),
    dialogMediaType: document.getElementById('dialog-media-type'),
    dialogControls: document.getElementById('dialog-controls'),
    dialogPrev: document.getElementById('dialog-prev'),
    dialogNext: document.getElementById('dialog-next'),
    dialogPosition: document.getElementById('dialog-position')
  };

  function normalize(value) {
    return String(value || '')
      .toLocaleLowerCase('pt-BR')
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '');
  }

  function makeElement(tagName, className, text) {
    var node = document.createElement(tagName);
    if (className) {
      node.className = className;
    }
    if (text !== undefined && text !== null) {
      node.textContent = String(text);
    }
    return node;
  }

  function getCategories(post) {
    if (!Array.isArray(post.categories)) {
      return [];
    }
    return post.categories
      .map(function (category) {
        return String(category || '').trim();
      })
      .filter(Boolean)
      .filter(function (category, index, allCategories) {
        return allCategories.indexOf(category) === index;
      });
  }

  function getImages(post) {
    if (!Array.isArray(post.images)) {
      return [];
    }
    return post.images.filter(function (image) {
      return image && typeof image === 'object' && String(image.src || '').trim();
    });
  }

  function getYear(post) {
    var explicitYear = String(post.year || '').trim();
    if (explicitYear) {
      return explicitYear;
    }
    var dateMatch = String(post.date || '').match(/^(\d{4})/);
    return dateMatch ? dateMatch[1] : '';
  }

  function getTitle(post) {
    var title = String(post.title || '').trim();
    return title || 'Publicação do Colégio Ação';
  }

  function getSummary(post) {
    return String(post.summary || '').trim();
  }

  function formatDate(dateValue) {
    var match = String(dateValue || '').match(/^(\d{4})-(\d{2})-(\d{2})/);
    if (!match) {
      return String(dateValue || '').trim();
    }
    var year = Number(match[1]);
    var month = Number(match[2]);
    var day = Number(match[3]);
    var date = new Date(year, month - 1, day);
    if (Number.isNaN(date.getTime())) {
      return String(dateValue || '').trim();
    }
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    }).format(date).replace('.', '');
  }

  function formatNumber(value) {
    return new Intl.NumberFormat('pt-BR').format(value);
  }

  function getSource(post) {
    var source = String(post.source || '').trim();
    if (!source) {
      return '';
    }
    try {
      var url = new URL(source, window.location.href);
      if (url.protocol !== 'https:' || !/(^|\.)instagram\.com$/i.test(url.hostname)) {
        return '';
      }
      return url.href;
    } catch (error) {
      return '';
    }
  }

  function getImageAlt(image, post, imageIndex) {
    var alt = String(image.alt || '').trim();
    if (alt) {
      return alt;
    }
    var title = getTitle(post);
    var suffix = getImages(post).length > 1 ? ' — imagem ' + (imageIndex + 1) : '';
    return title + suffix;
  }

  function getSearchText(post) {
    return [
      getTitle(post),
      getSummary(post),
      getYear(post),
      post.date,
      getCategories(post).join(' ')
    ].join(' ');
  }

  function getFilteredPosts() {
    var query = normalize(state.query.trim());
    return orderedPosts.filter(function (post) {
      var yearMatches = state.year === ALL_YEARS || getYear(post) === state.year;
      var categories = getCategories(post);
      var themeMatches = !state.theme || categories.some(function (category) {
        return category === state.theme;
      });
      var queryMatches = !query || normalize(getSearchText(post)).indexOf(query) !== -1;
      return yearMatches && themeMatches && queryMatches;
    });
  }

  function collectThemes() {
    var themes = [];
    orderedPosts.forEach(function (post) {
      getCategories(post).forEach(function (category) {
        if (themes.indexOf(category) === -1) {
          themes.push(category);
        }
      });
    });
    return themes.sort(function (first, second) {
      return first.localeCompare(second, 'pt-BR');
    });
  }

  function renderThemes() {
    var selectedTheme = state.theme;
    var themes = collectThemes();
    elements.themeFilter.replaceChildren();
    elements.themeFilter.appendChild(makeElement('option', '', 'Todos os temas'));
    elements.themeFilter.firstElementChild.value = '';
    themes.forEach(function (theme) {
      var option = makeElement('option', '', theme);
      option.value = theme;
      elements.themeFilter.appendChild(option);
    });
    if (selectedTheme && themes.indexOf(selectedTheme) !== -1) {
      elements.themeFilter.value = selectedTheme;
    } else {
      state.theme = '';
      elements.themeFilter.value = '';
    }
  }

  function updateYearButtons() {
    Array.prototype.forEach.call(elements.yearFilters.querySelectorAll('[data-year]'), function (button) {
      var isActive = button.getAttribute('data-year') === state.year;
      button.classList.toggle('is-active', isActive);
      button.setAttribute('aria-pressed', String(isActive));
    });
  }

  function hasActiveFilters() {
    return Boolean(state.query.trim() || state.theme || state.year !== ALL_YEARS);
  }

  function updateSummary(filteredPosts) {
    var total = filteredPosts.length;
    var noun = total === 1 ? 'publicação encontrada' : 'publicações encontradas';
    elements.resultCount.textContent = formatNumber(total) + ' ' + noun;
    elements.heroTotal.textContent = formatNumber(posts.length) + (posts.length === 1 ? ' publicação' : ' publicações');
    elements.clearFilters.hidden = !hasActiveFilters();
  }

  function createCard(post) {
    var images = getImages(post);
    var categories = getCategories(post);
    var title = getTitle(post);
    var cardButton = makeElement('button', 'archive-post-card', '');
    cardButton.type = 'button';
    cardButton.setAttribute('aria-label', 'Abrir publicação: ' + title + ', ' + formatDate(post.date));
    cardButton.addEventListener('click', function () {
      openDialog(post, cardButton);
    });

    var media = makeElement('span', 'archive-post-media');
    if (images.length) {
      var image = document.createElement('img');
      image.src = String(images[0].src).trim();
      var thumbBase = String(images[0].src).trim().replace(/^assets\/posts\/(.+)\.webp$/, 'assets/posts/thumb/$1');
      if (thumbBase.indexOf('assets/posts/thumb/') === 0) { image.src = thumbBase + '-480.webp'; image.srcset = thumbBase + '-480.webp 480w, ' + thumbBase + '-800.webp 800w'; image.sizes = '(max-width: 700px) 50vw, 400px'; }
      image.alt = getImageAlt(images[0], post, 0);
      image.loading = 'lazy';
      image.decoding = 'async';
      media.appendChild(image);
    } else {
      media.appendChild(makeElement('span', 'archive-post-no-image', 'Imagem não disponível'));
    }
    if (images.length > 1) {
      media.appendChild(makeElement('span', 'archive-post-image-count', images.length + ' imagens'));
    }
    if (Number(post.mediaType) === 2) {
      media.appendChild(makeElement('span', 'archive-post-media-type', 'Capa de vídeo'));
    }
    cardButton.appendChild(media);

    var cardBody = makeElement('span', 'archive-post-body');
    var meta = makeElement('span', 'archive-post-meta');
    meta.appendChild(makeElement('span', 'archive-post-date', formatDate(post.date)));
    meta.appendChild(makeElement('span', 'archive-post-year', getYear(post)));
    cardBody.appendChild(meta);
    cardBody.appendChild(makeElement('span', 'archive-post-title', title));

    var summary = getSummary(post);
    if (summary) {
      cardBody.appendChild(makeElement('span', 'archive-post-summary', summary));
    }

    if (categories.length) {
      var tags = makeElement('span', 'archive-post-tags');
      categories.forEach(function (category) {
        tags.appendChild(makeElement('span', 'archive-tag', category));
      });
      cardBody.appendChild(tags);
    }
    cardBody.appendChild(makeElement('span', 'archive-post-open-label', 'Ver publicação +'));
    cardButton.appendChild(cardBody);
    return cardButton;
  }

  function render() {
    var filteredPosts = getFilteredPosts();
    var visiblePosts = filteredPosts.slice(0, state.visible);
    elements.grid.replaceChildren();
    visiblePosts.forEach(function (post) {
      elements.grid.appendChild(createCard(post));
    });
    elements.grid.setAttribute('aria-busy', 'false');
    elements.emptyState.hidden = filteredPosts.length !== 0;
    elements.loadMore.hidden = filteredPosts.length <= state.visible;
    elements.loadStatus.textContent = filteredPosts.length > state.visible
      ? formatNumber(state.visible) + ' de ' + formatNumber(filteredPosts.length) + ' publicações exibidas.'
      : '';
    updateSummary(filteredPosts);
    updateYearButtons();
  }

  function clearFilters() {
    state.query = '';
    state.year = ALL_YEARS;
    state.theme = '';
    state.visible = PAGE_SIZE;
    elements.search.value = '';
    elements.themeFilter.value = '';
    render();
    elements.search.focus();
  }

  function renderDialogTags(categories) {
    elements.dialogTags.replaceChildren();
    categories.forEach(function (category) {
      elements.dialogTags.appendChild(makeElement('span', 'archive-tag', category));
    });
    elements.dialogTags.hidden = categories.length === 0;
  }

  function renderDialogImage() {
    var post = state.activePost;
    if (!post) {
      return;
    }
    var images = getImages(post);
    var image = images[state.activeImage];
    if (image) {
      elements.dialogImage.src = String(image.src).trim();
      elements.dialogImage.alt = getImageAlt(image, post, state.activeImage);
      elements.dialogImage.hidden = false;
      elements.dialogNoImage.hidden = true;
    } else {
      elements.dialogImage.removeAttribute('src');
      elements.dialogImage.alt = '';
      elements.dialogImage.hidden = true;
      elements.dialogNoImage.hidden = false;
    }

    var hasGallery = images.length > 1;
    elements.dialogControls.hidden = !hasGallery;
    elements.dialogPosition.textContent = images.length ? (state.activeImage + 1) + ' / ' + images.length : '0 / 0';
    elements.dialogPrev.disabled = !hasGallery || state.activeImage === 0;
    elements.dialogNext.disabled = !hasGallery || state.activeImage === images.length - 1;
  }

  function renderDialog() {
    var post = state.activePost;
    if (!post) {
      return;
    }
    var categories = getCategories(post);
    var mediaType = Number(post.mediaType);
    elements.dialogKicker.textContent = mediaType === 2 ? 'Publicação em vídeo' : 'Publicação do Instagram';
    elements.dialogDate.textContent = formatDate(post.date) + (getYear(post) ? ' · ' + getYear(post) : '');
    elements.dialogTitle.textContent = getTitle(post);
    elements.dialogSummary.textContent = getSummary(post);
    elements.dialogSummary.hidden = !getSummary(post);
    renderDialogTags(categories);

    var source = getSource(post);
    if (source) {
      elements.dialogSource.href = source;
      elements.dialogSource.hidden = false;
    } else {
      elements.dialogSource.removeAttribute('href');
      elements.dialogSource.hidden = true;
    }

    if (mediaType === 2) {
      elements.dialogMediaType.textContent = 'Capa de vídeo';
      elements.dialogMediaType.hidden = false;
    } else if (mediaType === 8) {
      elements.dialogMediaType.textContent = 'Carrossel';
      elements.dialogMediaType.hidden = false;
    } else {
      elements.dialogMediaType.textContent = '';
      elements.dialogMediaType.hidden = true;
    }
    renderDialogImage();
  }

  function openDialog(post, trigger) {
    state.activePost = post;
    state.activeImage = 0;
    state.lastTrigger = trigger;
    renderDialog();
    document.body.classList.add('archive-dialog-open');
    if (typeof elements.dialog.showModal === 'function') {
      elements.dialog.showModal();
    } else {
      elements.dialog.setAttribute('open', '');
    }
    elements.dialogClose.focus();
  }

  function finishDialogClose() {
    document.body.classList.remove('archive-dialog-open');
    if (state.lastTrigger && document.body.contains(state.lastTrigger)) {
      state.lastTrigger.focus();
    }
    state.lastTrigger = null;
    state.activePost = null;
  }

  function closeDialog() {
    if (elements.dialog.open && typeof elements.dialog.close === 'function') {
      elements.dialog.close();
    } else {
      elements.dialog.removeAttribute('open');
      finishDialogClose();
    }
  }

  function moveDialogImage(direction) {
    if (!state.activePost) {
      return;
    }
    var images = getImages(state.activePost);
    var nextIndex = state.activeImage + direction;
    if (nextIndex < 0 || nextIndex >= images.length) {
      return;
    }
    state.activeImage = nextIndex;
    renderDialogImage();
  }

  elements.search.addEventListener('input', function (event) {
    state.query = event.target.value;
    state.visible = PAGE_SIZE;
    render();
  });

  elements.yearFilters.addEventListener('click', function (event) {
    var button = event.target.closest('[data-year]');
    if (!button) {
      return;
    }
    state.year = button.getAttribute('data-year') || ALL_YEARS;
    state.visible = PAGE_SIZE;
    render();
  });

  elements.themeFilter.addEventListener('change', function (event) {
    state.theme = event.target.value;
    state.visible = PAGE_SIZE;
    render();
  });

  elements.clearFilters.addEventListener('click', clearFilters);
  elements.emptyClear.addEventListener('click', clearFilters);
  elements.loadMore.addEventListener('click', function () {
    state.visible += PAGE_SIZE;
    render();
  });
  elements.dialogClose.addEventListener('click', closeDialog);
  elements.dialogPrev.addEventListener('click', function () {
    moveDialogImage(-1);
  });
  elements.dialogNext.addEventListener('click', function () {
    moveDialogImage(1);
  });
  elements.dialog.addEventListener('cancel', function (event) {
    event.preventDefault();
    closeDialog();
  });
  elements.dialog.addEventListener('close', finishDialogClose);
  elements.dialog.addEventListener('click', function (event) {
    if (event.target === elements.dialog) {
      closeDialog();
    }
  });
  document.addEventListener('keydown', function (event) {
    if (!elements.dialog.open) {
      return;
    }
    if (event.key === 'ArrowLeft') {
      event.preventDefault();
      moveDialogImage(-1);
    }
    if (event.key === 'ArrowRight') {
      event.preventDefault();
      moveDialogImage(1);
    }
  });

  var initialTheme = new URLSearchParams(window.location.search).get('tema');
  if (initialTheme && collectThemes().indexOf(initialTheme) !== -1) state.theme = initialTheme;
  renderThemes();
  updateSummary(orderedPosts);
  render();
})();
