// Function to create a highlight background
function createHighlightBackground(startLineDiv, endLineDiv) {
    requestAnimationFrame(() => {
        const startRect = startLineDiv.getBoundingClientRect();
        const endRect = endLineDiv.getBoundingClientRect();
        const diffColumn = startLineDiv.closest('.diff-column');
        const diffRect = diffColumn.getBoundingClientRect();
        
        const background = document.createElement('div');
        background.classList.add('highlight-background');
        
        // Calculate the height and position
        const height = endRect.bottom - startRect.top;
        background.style.top = `${startRect.top - diffRect.top}px`;
        background.style.height = `${height}px`;
        
        diffColumn.appendChild(background);
    });
}

// Function to create hover region
function createHoverRegion(startLineDiv, endLineDiv, snippetId) {
    const startBarsContainer = startLineDiv.querySelector('.bars-container');
    const endBarsContainer = endLineDiv.querySelector('.bars-container');
    const diffColumn = startLineDiv.closest('.diff-column');
    
    requestAnimationFrame(() => {
        const startRect = startBarsContainer.getBoundingClientRect();
        const endRect = endBarsContainer.getBoundingClientRect();
        const diffRect = diffColumn.getBoundingClientRect();
        
        const hoverRegion = document.createElement('div');
        hoverRegion.classList.add('hover-region');
        hoverRegion.dataset.snippetId = snippetId;
        
        // Calculate the height and position based on the bars container
        const height = endRect.bottom - startRect.top;
        hoverRegion.style.top = `${startRect.top - diffRect.top}px`;
        hoverRegion.style.height = `${height}px`;
        
        diffColumn.appendChild(hoverRegion);
        
        // Add hover listeners
        hoverRegion.addEventListener('mouseenter', () => {
            // Dim all bars
            document.querySelectorAll('.highlight-multiline').forEach(bar => {
                bar.classList.add('dimmed');
            });
            // Un-dim bars for this snippet
            document.querySelectorAll(`[data-snippet-id="${snippetId}"]`).forEach(el => {
                el.classList.remove('dimmed');
                el.classList.add('hover');
            });
        });
        
        hoverRegion.addEventListener('mouseleave', () => {
            // Remove all dimming and hover states
            document.querySelectorAll('.highlight-multiline').forEach(bar => {
                bar.classList.remove('dimmed', 'hover');
            });
        });
    });
}

// Function to create vertical bars
function createVerticalBar(startLineDiv, endLineDiv, highlightClass, badgeNumber, snippetId) {
    const startBarsContainer = startLineDiv.querySelector('.bars-container');
    const endBarsContainer = endLineDiv.querySelector('.bars-container');
    
    requestAnimationFrame(() => {
        const startRect = startBarsContainer.getBoundingClientRect();
        const endRect = endBarsContainer.getBoundingClientRect();
        
        const highlight = document.createElement('div');
        highlight.classList.add('highlight-multiline', highlightClass);
        highlight.dataset.snippetId = snippetId;
        
        // Add badge
        const badge = document.createElement('div');
        badge.classList.add('highlight-badge');
        badge.textContent = badgeNumber;
        highlight.appendChild(badge);
        
        // Calculate the height
        const height = endRect.bottom - startRect.top;
        highlight.style.height = `${height}px`;
        
        // Add the highlight to the first bars container
        startBarsContainer.appendChild(highlight);
        
        // Add hover effect to the bar
        highlight.addEventListener('mouseenter', () => {
            // Dim all bars
            document.querySelectorAll('.highlight-multiline').forEach(bar => {
                bar.classList.add('dimmed');
            });
            // Un-dim bars for this snippet
            document.querySelectorAll(`[data-snippet-id="${snippetId}"]`).forEach(el => {
                el.classList.remove('dimmed');
                el.classList.add('hover');
            });
        });
        
        highlight.addEventListener('mouseleave', () => {
            // Remove all dimming and hover states
            document.querySelectorAll('.highlight-multiline').forEach(bar => {
                bar.classList.remove('dimmed', 'hover');
            });
        });
    });
}

// Function to clear all highlights
function clearHighlights() {
    document.querySelectorAll('.highlight-multiline, .highlight-background, .hover-region').forEach(el => el.remove());
}

// Function to update highlights on window resize
function updateHighlights() {
    // Store the highlight ranges
    const highlights = [
        // First section: Single highlight without bars (lines 1-4)
        {
            start: 1,
            end: 4,
            type: 'single',
            snippetId: 'snippet1'
        },
        // Third section: Overlapping highlights with bars (lines 11-15 and 15-16)
        {
            start: 10,
            end: 15,
            type: 'overlap',
            class: 'highlight1',  // First bar
            backgroundEnd: 15,
            badgeNumber: '1',
            snippetId: 'snippet2'
        },
        {
            start: 13,
            end: 16,
            type: 'overlap',
            class: 'highlight2',  // Second bar
            backgroundEnd: 15,
            badgeNumber: '2',
            snippetId: 'snippet3'
        }
    ];
    
    // Clear existing highlights
    clearHighlights();
    
    // Create hover regions first
    highlights.forEach(range => {
        const startLine = document.querySelector(`.code-line-container:nth-child(${range.start})`);
        const endLine = document.querySelector(`.code-line-container:nth-child(${range.end})`);
        
        if (startLine && endLine) {
            createHoverRegion(startLine, endLine, range.snippetId);
        }
    });
    
    // Create a single background for the overlapped section
    const overlappingRanges = highlights.filter(r => r.type === 'overlap');
    if (overlappingRanges.length > 0) {
        const minStart = Math.min(...overlappingRanges.map(r => r.start));
        const maxBackgroundEnd = Math.max(...overlappingRanges.map(r => r.backgroundEnd || r.start));
        
        const startLine = document.querySelector(`.code-line-container:nth-child(${minStart})`);
        const endLine = document.querySelector(`.code-line-container:nth-child(${maxBackgroundEnd})`);
        
        if (startLine && endLine) {
            createHighlightBackground(startLine, endLine);
        }
    }
    
    // Create single highlights
    highlights.filter(r => r.type === 'single').forEach(range => {
        const startLine = document.querySelector(`.code-line-container:nth-child(${range.start})`);
        const endLine = document.querySelector(`.code-line-container:nth-child(${range.end})`);
        
        if (startLine && endLine) {
            createHighlightBackground(startLine, endLine);
        }
    });
    
    // Create bars for overlapping highlights
    highlights.forEach(range => {
        if (range.type === 'overlap' && range.class) {
            const startLine = document.querySelector(`.code-line-container:nth-child(${range.start})`);
            const endLine = document.querySelector(`.code-line-container:nth-child(${range.end})`);
            
            if (startLine && endLine) {
                createVerticalBar(startLine, endLine, range.class, range.badgeNumber, range.snippetId);
            }
        }
    });
}

// Initialize highlights
document.addEventListener('DOMContentLoaded', () => {
    updateHighlights();
    
    // Update highlights when window is resized
    let resizeTimeout;
    window.addEventListener('resize', () => {
        // Debounce resize events
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(updateHighlights, 100);
    });
});