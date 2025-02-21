// Function to get element height including computed styles
function getElementHeight(element) {
    const computedStyle = window.getComputedStyle(element);
    return element.getBoundingClientRect().height + 
           parseFloat(computedStyle.marginTop) + 
           parseFloat(computedStyle.marginBottom);
}

// Function to create a highlight background
function createHighlightBackground(startLineDiv, endLineDiv) {
    const diffColumn = startLineDiv.closest('.diff-column');
    
    requestAnimationFrame(() => {
        const startRect = startLineDiv.getBoundingClientRect();
        const diffRect = diffColumn.getBoundingClientRect();
        
        // Calculate total height based on number of lines
        let totalHeight = 0;
        let currentLine = startLineDiv;
        while (currentLine && currentLine !== endLineDiv.nextElementSibling) {
            totalHeight += getElementHeight(currentLine);
            currentLine = currentLine.nextElementSibling;
        }
        
        const background = document.createElement('div');
        background.classList.add('highlight-background');
        
        background.style.top = `${startRect.top - diffRect.top}px`;
        background.style.height = `${totalHeight}px`;
        
        diffColumn.appendChild(background);
    });
}

// Function to create hover region
function createHoverRegion(startLineDiv, endLineDiv, snippetId) {
    const diffColumn = startLineDiv.closest('.diff-column');
    
    requestAnimationFrame(() => {
        const startRect = startLineDiv.getBoundingClientRect();
        const diffRect = diffColumn.getBoundingClientRect();
        
        // Calculate total height based on number of lines
        let totalHeight = 0;
        let currentLine = startLineDiv;
        while (currentLine && currentLine !== endLineDiv.nextElementSibling) {
            totalHeight += getElementHeight(currentLine);
            currentLine = currentLine.nextElementSibling;
        }
        
        const hoverRegion = document.createElement('div');
        hoverRegion.classList.add('hover-region');
        hoverRegion.dataset.snippetId = snippetId;
        
        hoverRegion.style.top = `${startRect.top - diffRect.top}px`;
        hoverRegion.style.height = `${totalHeight}px`;
        
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
    
    requestAnimationFrame(() => {
        // Calculate total height based on number of lines
        let totalHeight = 0;
        let currentLine = startLineDiv;
        while (currentLine && currentLine !== endLineDiv.nextElementSibling) {
            totalHeight += getElementHeight(currentLine);
            currentLine = currentLine.nextElementSibling;
        }
        
        const highlight = document.createElement('div');
        highlight.classList.add('highlight-multiline', highlightClass);
        highlight.dataset.snippetId = snippetId;
        
        // Add badge
        const badge = document.createElement('div');
        badge.classList.add('highlight-badge');
        badge.textContent = badgeNumber;
        highlight.appendChild(badge);
        
        // Set the height
        highlight.style.height = `${totalHeight}px`;
        
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
    const singleHighlights = [
        // Component decorator highlight
        {
            start: 1,
            end: 2,
            type: 'single',
            snippetId: 'snippet1'
        }
    ];
    
    const overlappingHighlights = [
        // Template section with overlapping highlights
        {
            start: 8,
            end: 16,
            type: 'overlap',
            class: 'highlight1',
            hoverEnd: 16,
            badgeNumber: '1',
            snippetId: 'snippet2'
        },
        // User stats section
        {
            start: 11,
            end: 14,
            type: 'overlap',
            class: 'highlight2',
            hoverEnd: 14,
            badgeNumber: '2',
            snippetId: 'snippet3'
        }
    ];
    
    // Clear existing highlights
    clearHighlights();
    
    // Create hover regions first
    singleHighlights.forEach(range => {
        const startLine = document.querySelector(`.code-line-container:nth-child(${range.start})`);
        const endLine = document.querySelector(`.code-line-container:nth-child(${range.end})`);
        
        if (startLine && endLine) {
            createHighlightBackground(startLine, endLine);
            // Create hover region without dimming effect
            const hoverRegion = document.createElement('div');
            hoverRegion.classList.add('hover-region');
            hoverRegion.dataset.snippetId = range.snippetId;
            
            const startRect = startLine.getBoundingClientRect();
            const diffRect = startLine.closest('.diff-column').getBoundingClientRect();
            
            // Calculate total height based on number of lines
            let totalHeight = 0;
            let currentLine = startLine;
            while (currentLine && currentLine !== endLine.nextElementSibling) {
                totalHeight += getElementHeight(currentLine);
                currentLine = currentLine.nextElementSibling;
            }
            
            hoverRegion.style.top = `${startRect.top - diffRect.top}px`;
            hoverRegion.style.height = `${totalHeight}px`;
            
            startLine.closest('.diff-column').appendChild(hoverRegion);
            
            // Add hover listeners without dimming effect
            hoverRegion.addEventListener('mouseenter', () => {
                document.querySelectorAll(`[data-snippet-id="${range.snippetId}"]`).forEach(el => {
                    el.classList.add('hover');
                });
            });
            
            hoverRegion.addEventListener('mouseleave', () => {
                document.querySelectorAll(`[data-snippet-id="${range.snippetId}"]`).forEach(el => {
                    el.classList.remove('hover');
                });
            });
        }
    });
    
    overlappingHighlights.forEach(range => {
        const startLine = document.querySelector(`.code-line-container:nth-child(${range.start})`);
        const endLine = document.querySelector(`.code-line-container:nth-child(${range.hoverEnd || range.end})`);
        
        if (startLine && endLine) {
            createHoverRegion(startLine, endLine, range.snippetId);
        }
    });
    
    // Create a single background for the overlapped section
    const overlappingRanges = overlappingHighlights;
    if (overlappingRanges.length > 0) {
        const minStart = Math.min(...overlappingRanges.map(r => r.start));
        const maxEnd = Math.max(...overlappingRanges.map(r => r.hoverEnd || r.end));
        
        const startLine = document.querySelector(`.code-line-container:nth-child(${minStart})`);
        const endLine = document.querySelector(`.code-line-container:nth-child(${maxEnd})`);
        
        if (startLine && endLine) {
            createHighlightBackground(startLine, endLine);
        }
    }
    
    // Create bars for overlapping highlights
    overlappingHighlights.forEach(range => {
        if (range.type === 'overlap' && range.class) {
            const startLine = document.querySelector(`.code-line-container:nth-child(${range.start})`);
            // Use hoverEnd if defined, otherwise use end for consistency with hover region
            const endLine = document.querySelector(`.code-line-container:nth-child(${range.hoverEnd || range.end})`);
            
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