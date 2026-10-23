/**
 * ============================================================================
 * LinkedList Lab - Interactive DSA Visualizer
 * Problem: "Add Two Numbers Represented by Linked Lists" (LeetCode #2)
 *
 * Core Data Structures, Algorithms, UI Controller, and Validation
 * ============================================================================
 */

'use strict';

/* ============================================================================
   1. Core Data Structures: Singly Linked List
   ============================================================================ */

/**
 * Standard definition for a singly-linked list node.
 */
class ListNode {
  constructor(val = 0, next = null) {
    this.val = Number(val);
    this.next = next;
  }
}

/**
 * Builds a reverse-order singly linked list from a clean digit string.
 * Example: "342" -> Head(2) -> Node(4) -> Node(3) -> null
 * Least significant digit (units place 10^0) is placed at the head.
 *
 * @param {string} numStr Non-negative whole number as string
 * @returns {ListNode|null} Head of the constructed linked list
 */
function createLinkedListFromNumberString(numStr) {
  if (!numStr || typeof numStr !== 'string') return null;

  // Clean string and strip leading zeros unless single '0'
  const cleaned = numStr.replace(/^0+(?=\d)/, '');
  if (!/^\d+$/.test(cleaned)) return null;

  // Digits from right to left (units first)
  const reversedDigits = cleaned.split('').reverse().map(Number);

  const dummy = new ListNode(0);
  let curr = dummy;
  for (const digit of reversedDigits) {
    curr.next = new ListNode(digit);
    curr = curr.next;
  }

  return dummy.next;
}

/**
 * Traverses a linked list and converts its values into an array.
 * @param {ListNode|null} head
 * @returns {number[]}
 */
function linkedListToArray(head) {
  const result = [];
  let curr = head;
  while (curr !== null) {
    result.push(curr.val);
    curr = curr.next;
  }
  return result;
}

/**
 * Converts a reverse-order linked list back to its standard decimal number string.
 * Example: List with values [7, 0, 8] -> "807"
 * @param {ListNode|null} head
 * @returns {string}
 */
function linkedListToDecimalString(head) {
  if (!head) return '0';
  const digits = linkedListToArray(head);
  if (digits.length === 0) return '0';
  // Digits are in reverse order, reverse them back to standard decimal order
  return digits.slice().reverse().join('');
}

/**
 * Returns a human-friendly place value name for an index (0 = Units, 1 = Tens, etc.)
 * @param {number} index
 * @returns {string}
 */
function getPlaceName(index) {
  const places = [
    'Units (10⁰)',
    'Tens (10¹)',
    'Hundreds (10²)',
    'Thousands (10³)',
    'Ten Thousands (10⁴)',
    'Hundred Thousands (10⁵)',
    'Millions (10⁶)',
    'Ten Millions (10⁷)',
    'Hundred Millions (10⁸)',
    'Billions (10⁹)'
  ];
  if (index < places.length) {
    return places[index];
  }
  return `10^${index} Place`;
}

/* ============================================================================
   2. Standard Addition Algorithm with Step Recording
   ============================================================================ */

/**
 * Executes the standard node-by-node linked list addition algorithm while
 * recording comprehensive step snapshots for the visualizer.
 *
 * Handles:
 * - Equal & unequal list lengths
 * - Carry propagation
 * - Final carry appending a new most-significant node
 *
 * @param {ListNode|null} l1 Head of first list (least significant digit first)
 * @param {ListNode|null} l2 Head of second list (least significant digit first)
 * @returns {Object} { resultHead, steps, totalSumString, totalSteps }
 */
function addTwoNumbersWithSteps(l1, l2) {
  const dummyHead = new ListNode(0);
  let curr = dummyHead;
  let carry = 0;

  let p1 = l1;
  let p2 = l2;
  let stepIndex = 0;
  const steps = [];

  while (p1 !== null || p2 !== null || carry !== 0) {
    const val1 = p1 !== null ? p1.val : 0;
    const val2 = p2 !== null ? p2.val : 0;
    const carryIn = carry;

    const sum = val1 + val2 + carryIn;
    const outputDigit = sum % 10;
    const carryOut = Math.floor(sum / 10);

    // Create the new node in the result linked list
    curr.next = new ListNode(outputDigit);
    curr = curr.next;

    // Narrative generation
    let explanation = '';
    const place = getPlaceName(stepIndex);

    if (p1 !== null && p2 !== null) {
      explanation = `Adding ${place}: ${val1} (from List 1) + ${val2} (from List 2) + ${carryIn} (carry-in) = ${sum}. New node digit is ${outputDigit}; carry-out is ${carryOut}.`;
    } else if (p1 !== null && p2 === null) {
      explanation = `List 2 has ended (NULL treated as 0). Adding ${place}: ${val1} (from List 1) + 0 + ${carryIn} (carry-in) = ${sum}. New node digit is ${outputDigit}; carry-out is ${carryOut}.`;
    } else if (p1 === null && p2 !== null) {
      explanation = `List 1 has ended (NULL treated as 0). Adding ${place}: 0 + ${val2} (from List 2) + ${carryIn} (carry-in) = ${sum}. New node digit is ${outputDigit}; carry-out is ${carryOut}.`;
    } else {
      // Both lists null, final carry only
      explanation = `Both lists have reached NULL, but carry-in is ${carryIn}. Appending a final node with digit ${outputDigit} to represent the highest place value.`;
    }

    // Capture snapshot of result list nodes up to this step
    const resultNodesSoFar = linkedListToArray(dummyHead.next);

    steps.push({
      stepIndex,
      stepNumber: stepIndex + 1,
      placeName: place,
      node1Exists: p1 !== null,
      node2Exists: p2 !== null,
      activeNodeIndex1: p1 !== null ? stepIndex : null,
      activeNodeIndex2: p2 !== null ? stepIndex : null,
      digit1: val1,
      digit2: val2,
      carryIn: carryIn,
      sum: sum,
      outputDigit: outputDigit,
      carryOut: carryOut,
      explanation: explanation,
      resultNodesSoFar: [...resultNodesSoFar]
    });

    // Advance carry & pointers for next iteration
    carry = carryOut;
    if (p1 !== null) p1 = p1.next;
    if (p2 !== null) p2 = p2.next;
    stepIndex++;
  }

  const resultHead = dummyHead.next;
  const totalSumString = linkedListToDecimalString(resultHead);

  return {
    resultHead,
    steps,
    totalSumString,
    totalSteps: steps.length
  };
}

/* ============================================================================
   3. Application State & UI Controller
   ============================================================================ */

class LinkedListLabApp {
  constructor() {
    this.l1Head = null;
    this.l2Head = null;
    this.calculationResult = null;
    this.currentStep = 0;
    this.isPlaying = false;
    this.playTimer = null;
    this.animationSpeed = 1000; // ms

    this.initElements();
    this.attachEventListeners();
    this.runInitialCalculation();
  }

  /**
   * Cache all required DOM references.
   */
  initElements() {
    // Form & Inputs
    this.form = document.getElementById('calc-form');
    this.num1Input = document.getElementById('num1-input');
    this.num2Input = document.getElementById('num2-input');
    this.num1Error = document.getElementById('num1-error');
    this.num2Error = document.getElementById('num2-error');
    this.globalError = document.getElementById('global-error');
    this.globalErrorText = document.getElementById('global-error-text');
    this.clearNum1Btn = document.getElementById('clear-num1');
    this.clearNum2Btn = document.getElementById('clear-num2');

    // Action Buttons
    this.btnAddNumbers = document.getElementById('btn-add-numbers');
    this.btnStepByStep = document.getElementById('btn-step-by-step');
    this.btnReset = document.getElementById('btn-reset');
    this.presetButtons = document.querySelectorAll('.btn-preset');

    // Stepper Controls
    this.stepperCard = document.getElementById('stepper-card');
    this.stepCounterBadge = document.getElementById('step-counter-badge');
    this.stepPlaceTag = document.getElementById('step-place-tag');
    this.stepperProgressBar = document.getElementById('stepper-progress-bar');
    this.btnStepPrev = document.getElementById('btn-step-prev');
    this.btnStepPlay = document.getElementById('btn-step-play');
    this.btnStepNext = document.getElementById('btn-step-next');
    this.playIcon = document.getElementById('play-icon');
    this.playText = document.getElementById('play-text');
    this.speedSelect = document.getElementById('speed-select');

    // The 6 Metric Displays in Math Inspector
    this.valDigit1 = document.getElementById('val-digit1');
    this.valDigit2 = document.getElementById('val-digit2');
    this.valCarryIn = document.getElementById('val-carry-in');
    this.valSum = document.getElementById('val-sum');
    this.valOutputDigit = document.getElementById('val-output-digit');
    this.valCarryOut = document.getElementById('val-carry-out');
    this.stepEquationBadge = document.getElementById('step-equation-badge');
    this.stepNarrativeText = document.getElementById('step-narrative-text');

    // Visualizer Node Containers
    this.list1NodesContainer = document.getElementById('list1-nodes-container');
    this.list2NodesContainer = document.getElementById('list2-nodes-container');
    this.resultNodesContainer = document.getElementById('result-nodes-container');
    this.list1OriginalVal = document.getElementById('list1-original-val');
    this.list2OriginalVal = document.getElementById('list2-original-val');
    this.resultSumVal = document.getElementById('result-sum-val');

    // Result Card
    this.resultSummaryCard = document.getElementById('result-summary-card');
    this.resNum1 = document.getElementById('res-num1');
    this.resNum2 = document.getElementById('res-num2');
    this.resTotal = document.getElementById('res-total');
    this.resReconstructionText = document.getElementById('res-reconstruction-text');
    this.resultChainPreview = document.getElementById('result-chain-preview');
    this.statSteps = document.getElementById('stat-steps');
    this.statNodes = document.getElementById('stat-nodes');
    this.statCarry = document.getElementById('stat-carry');

    // Code tabs & copy
    this.codeTabs = document.querySelectorAll('.code-tab');
    this.codePanels = document.querySelectorAll('.code-panel');
    this.btnCopyCode = document.getElementById('btn-copy-code');
    this.copyText = document.getElementById('copy-text');
    this.copyIcon = document.getElementById('copy-icon');
  }

  /**
   * Bind event listeners to UI components.
   */
  attachEventListeners() {
    // Form submission (Add Numbers button)
    this.form.addEventListener('submit', (e) => {
      e.preventDefault();
      this.handleCalculate(false);
    });

    // Step-by-Step trigger button
    this.btnStepByStep.addEventListener('click', () => {
      this.handleCalculate(true);
    });

    // Reset button
    this.btnReset.addEventListener('click', () => {
      this.handleReset();
    });

    // Clear input buttons
    this.clearNum1Btn.addEventListener('click', () => {
      this.num1Input.value = '';
      this.num1Input.focus();
      this.validateInputs();
    });
    this.clearNum2Btn.addEventListener('click', () => {
      this.num2Input.value = '';
      this.num2Input.focus();
      this.validateInputs();
    });

    // Live validation on typing
    this.num1Input.addEventListener('input', () => this.validateInputs());
    this.num2Input.addEventListener('input', () => this.validateInputs());

    // Preset buttons
    this.presetButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        this.presetButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const num1 = btn.getAttribute('data-num1');
        const num2 = btn.getAttribute('data-num2');
        this.num1Input.value = num1;
        this.num2Input.value = num2;
        this.handleCalculate(false);
      });
    });

    // Stepper navigation buttons
    this.btnStepPrev.addEventListener('click', () => this.prevStep());
    this.btnStepNext.addEventListener('click', () => this.nextStep());
    this.btnStepPlay.addEventListener('click', () => this.toggleAutoPlay());

    // Speed selector
    this.speedSelect.addEventListener('change', (e) => {
      this.animationSpeed = Number(e.target.value);
      if (this.isPlaying) {
        this.pauseAutoPlay();
        this.startAutoPlay();
      }
    });

    // Keyboard shortcuts for stepper: Left/Right arrows
    window.addEventListener('keydown', (e) => {
      // Don't intercept if focused on inputs
      if (document.activeElement === this.num1Input || document.activeElement === this.num2Input) {
        return;
      }
      if (e.key === 'ArrowRight') {
        if (!this.btnStepNext.disabled) {
          e.preventDefault();
          this.nextStep();
        }
      } else if (e.key === 'ArrowLeft') {
        if (!this.btnStepPrev.disabled) {
          e.preventDefault();
          this.prevStep();
        }
      } else if (e.key === ' ' || e.code === 'Space') {
        // Spacebar toggles auto-play if stepper is in view
        if (this.stepperCard.getBoundingClientRect().top < window.innerHeight &&
            this.stepperCard.getBoundingClientRect().bottom > 0) {
          e.preventDefault();
          this.toggleAutoPlay();
        }
      }
    });

    // Code tab switching
    this.codeTabs.forEach(tab => {
      tab.addEventListener('click', () => {
        this.codeTabs.forEach(t => {
          t.classList.remove('active');
          t.setAttribute('aria-selected', 'false');
        });
        this.codePanels.forEach(panel => {
          panel.classList.remove('active');
          panel.hidden = true;
        });

        tab.classList.add('active');
        tab.setAttribute('aria-selected', 'true');
        const targetId = tab.getAttribute('data-target');
        const targetPanel = document.getElementById(targetId);
        if (targetPanel) {
          targetPanel.classList.add('active');
          targetPanel.hidden = false;
        }
      });
    });

    // Copy code button
    this.btnCopyCode.addEventListener('click', () => {
      const activePanel = document.querySelector('.code-panel.active code');
      if (activePanel) {
        navigator.clipboard.writeText(activePanel.innerText).then(() => {
          this.copyText.textContent = 'Copied!';
          this.copyIcon.textContent = '✅';
          setTimeout(() => {
            this.copyText.textContent = 'Copy Code';
            this.copyIcon.textContent = '📋';
          }, 2000);
        }).catch(() => {
          this.copyText.textContent = 'Failed to copy';
          setTimeout(() => {
            this.copyText.textContent = 'Copy Code';
          }, 2000);
        });
      }
    });
  }

  /* ==========================================================================
     4. Validation
     ========================================================================== */

  /**
   * Validates both number inputs according to DSA criteria:
   * - Must not be empty.
   * - Must contain only non-negative integers (digits 0-9).
   * - Normalizes multiple leading zeros (e.g., "005" -> "5", "00" -> "0").
   *
   * @returns {boolean} true if valid, false otherwise
   */
  validateInputs() {
    let isValid = true;
    const rawVal1 = this.num1Input.value.trim();
    const rawVal2 = this.num2Input.value.trim();

    // Reset error states
    this.num1Error.textContent = '';
    this.num2Error.textContent = '';
    this.num1Input.classList.remove('input-invalid');
    this.num2Input.classList.remove('input-invalid');
    this.globalError.classList.add('hidden');

    // Validate Number 1
    if (rawVal1 === '') {
      this.num1Error.textContent = 'Please enter a number (cannot be empty).';
      this.num1Input.classList.add('input-invalid');
      isValid = false;
    } else if (!/^\d+$/.test(rawVal1)) {
      this.num1Error.textContent = 'Only non-negative whole numbers (0-9) are allowed.';
      this.num1Input.classList.add('input-invalid');
      isValid = false;
    }

    // Validate Number 2
    if (rawVal2 === '') {
      this.num2Error.textContent = 'Please enter a number (cannot be empty).';
      this.num2Input.classList.add('input-invalid');
      isValid = false;
    } else if (!/^\d+$/.test(rawVal2)) {
      this.num2Error.textContent = 'Only non-negative whole numbers (0-9) are allowed.';
      this.num2Input.classList.add('input-invalid');
      isValid = false;
    }

    return isValid;
  }

  /**
   * Normalizes a valid numeric string: removes leading zeros unless value is '0'.
   * @param {string} val
   * @returns {string}
   */
  normalizeNumberString(val) {
    const cleaned = val.replace(/^0+(?=\d)/, '');
    return cleaned === '' ? '0' : cleaned;
  }

  /* ==========================================================================
     5. Calculation & Step Control
     ========================================================================== */

  /**
   * Runs the calculation on current inputs.
   * @param {boolean} startInStepMode If true, sets step to 0 for interactive walkthrough.
   */
  handleCalculate(startInStepMode = false) {
    this.pauseAutoPlay();

    if (!this.validateInputs()) {
      this.globalErrorText.textContent = 'Please fix the errors above before proceeding.';
      this.globalError.classList.remove('hidden');
      return;
    }

    const clean1 = this.normalizeNumberString(this.num1Input.value.trim());
    const clean2 = this.normalizeNumberString(this.num2Input.value.trim());

    // Update input display with normalized values if leading zeros were stripped
    this.num1Input.value = clean1;
    this.num2Input.value = clean2;

    // 1. Construct genuine singly linked list nodes
    this.l1Head = createLinkedListFromNumberString(clean1);
    this.l2Head = createLinkedListFromNumberString(clean2);

    // 2. Execute standard DSA algorithm with step recording
    this.calculationResult = addTwoNumbersWithSteps(this.l1Head, this.l2Head);

    // 3. Render base visualizer chains
    this.list1OriginalVal.textContent = clean1;
    this.list2OriginalVal.textContent = clean2;
    this.resultSumVal.textContent = this.calculationResult.totalSumString;

    // 4. Update Result Card static details
    this.resNum1.textContent = clean1;
    this.resNum2.textContent = clean2;
    this.resTotal.textContent = this.calculationResult.totalSumString;
    this.statSteps.textContent = this.calculationResult.totalSteps;
    this.statNodes.textContent = linkedListToArray(this.calculationResult.resultHead).length;
    const lastStep = this.calculationResult.steps[this.calculationResult.steps.length - 1];
    this.statCarry.textContent = lastStep.carryOut;

    const resultArr = linkedListToArray(this.calculationResult.resultHead);
    this.resultChainPreview.textContent = resultArr.join(' → ') + ' → NULL';
    this.resReconstructionText.textContent = `Reconstructed by reading nodes from head to tail: ${resultArr.join(' → ')} (reverse order) = ${this.calculationResult.totalSumString}`;

    // 5. Set step position
    if (startInStepMode) {
      this.currentStep = 0;
      this.renderStep(this.currentStep);
      // Smooth scroll to stepper/inspector
      this.stepperCard.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    } else {
      // Direct "Add Numbers" view: Jump directly to the final completed step
      this.currentStep = this.calculationResult.totalSteps - 1;
      this.renderStep(this.currentStep);
    }
  }

  /**
   * Resets all inputs and visualizer to the default initial example (342 + 465).
   */
  handleReset() {
    this.pauseAutoPlay();
    this.num1Input.value = '342';
    this.num2Input.value = '465';
    this.num1Error.textContent = '';
    this.num2Error.textContent = '';
    this.globalError.classList.add('hidden');
    this.num1Input.classList.remove('input-invalid');
    this.num2Input.classList.remove('input-invalid');

    // Highlight preset 1
    this.presetButtons.forEach(btn => {
      btn.classList.toggle('active', btn.id === 'btn-preset-1');
    });

    this.handleCalculate(false);
  }

  /**
   * Initial page load calculation.
   */
  runInitialCalculation() {
    this.handleCalculate(false);
  }

  /* ==========================================================================
     6. Rendering Engine: Visualizer & Step Inspector
     ========================================================================== */

  /**
   * Renders the complete visual state for a given step index.
   * @param {number} stepIndex
   */
  renderStep(stepIndex) {
    if (!this.calculationResult || !this.calculationResult.steps[stepIndex]) return;

    const step = this.calculationResult.steps[stepIndex];
    const totalSteps = this.calculationResult.totalSteps;

    // --- Update Stepper Info & Progress ---
    this.stepCounterBadge.textContent = `Step ${step.stepNumber} of ${totalSteps}`;
    this.stepPlaceTag.textContent = `Processing ${step.placeName}`;
    const progressPercent = ((stepIndex + 1) / totalSteps) * 100;
    this.stepperProgressBar.style.width = `${progressPercent}%`;

    this.btnStepPrev.disabled = stepIndex === 0;
    this.btnStepNext.disabled = stepIndex === totalSteps - 1;

    // --- Update 6 Metric Inspector Displays ---
    this.valDigit1.textContent = step.digit1;
    this.valDigit2.textContent = step.digit2;
    this.valCarryIn.textContent = step.carryIn;
    this.valSum.textContent = step.sum;
    this.valOutputDigit.textContent = step.outputDigit;
    this.valCarryOut.textContent = step.carryOut;

    this.stepEquationBadge.textContent = `${step.digit1} + ${step.digit2} + ${step.carryIn} = ${step.sum} (Digit: ${step.outputDigit}, Carry: ${step.carryOut})`;
    this.stepNarrativeText.innerHTML = step.explanation.replace(
      /(\d+)/g,
      '<strong>$1</strong>'
    );

    // --- Render Node Chains ---
    const l1Arr = linkedListToArray(this.l1Head);
    const l2Arr = linkedListToArray(this.l2Head);

    this.renderNodeChain(
      this.list1NodesContainer,
      l1Arr,
      'node-l1',
      step.activeNodeIndex1,
      step.node1Exists
    );

    this.renderNodeChain(
      this.list2NodesContainer,
      l2Arr,
      'node-l2',
      step.activeNodeIndex2,
      step.node2Exists
    );

    this.renderResultChain(
      this.resultNodesContainer,
      step.resultNodesSoFar,
      stepIndex
    );
  }

  /**
   * Builds the DOM elements for an input linked list chain.
   *
   * @param {HTMLElement} container
   * @param {number[]} digitsArray
   * @param {string} themeClass 'node-l1' or 'node-l2'
   * @param {number|null} activeIndex Index of the currently processed node
   * @param {boolean} nodeExists Whether list still has a node at this step
   */
  renderNodeChain(container, digitsArray, themeClass, activeIndex, nodeExists) {
    container.innerHTML = '';

    if (digitsArray.length === 0) {
      container.innerHTML = '<span class="nodes-placeholder">Empty Linked List</span>';
      return;
    }

    digitsArray.forEach((digit, idx) => {
      const isHead = idx === 0;
      const isActive = idx === activeIndex;

      const itemWrap = document.createElement('div');
      itemWrap.className = `node-item-wrap ${themeClass}`;

      // Node box
      const nodeBox = document.createElement('div');
      nodeBox.className = `node-box ${isActive ? 'node-active' : ''}`;
      nodeBox.setAttribute('data-index', idx);
      nodeBox.title = `Node ${idx}: Digit ${digit} (${getPlaceName(idx)})`;

      if (isHead) {
        const headBadge = document.createElement('span');
        headBadge.className = 'node-head-badge';
        headBadge.textContent = 'HEAD';
        nodeBox.appendChild(headBadge);
      }

      const digitSpan = document.createElement('span');
      digitSpan.className = 'node-digit';
      digitSpan.textContent = digit;
      nodeBox.appendChild(digitSpan);

      const placeSpan = document.createElement('span');
      placeSpan.className = 'node-place-label';
      placeSpan.textContent = `10^${idx}`;
      nodeBox.appendChild(placeSpan);

      itemWrap.appendChild(nodeBox);

      // Arrow to next node
      const arrowWrap = document.createElement('div');
      arrowWrap.className = `node-pointer-arrow ${isActive ? 'arrow-active' : ''}`;
      arrowWrap.innerHTML = `
        <span class="arrow-label">.next</span>
        <div class="arrow-line"></div>
        <div class="arrow-head"></div>
      `;
      itemWrap.appendChild(arrowWrap);

      container.appendChild(itemWrap);
    });

    // Append distinct NULL node at tail
    const nullWrap = document.createElement('div');
    const isNullActive = !nodeExists; // Highlight NULL if this list has ended while addition continues
    nullWrap.className = `node-item-wrap ${isNullActive ? 'node-null-active' : ''}`;
    nullWrap.innerHTML = `
      <div class="node-null-box" title="End of Linked List (Null Pointer)">
        <span class="node-null-symbol">NULL</span>
        <span class="node-null-label">${isNullActive ? '(Treated as 0)' : 'Tail'}</span>
      </div>
    `;
    container.appendChild(nullWrap);
  }

  /**
   * Renders the Result Linked List up to the current step.
   *
   * @param {HTMLElement} container
   * @param {number[]} resultDigits Array of digits generated so far
   * @param {number} currentStepIndex Current visual step index
   */
  renderResultChain(container, resultDigits, currentStepIndex) {
    container.innerHTML = '';

    if (!resultDigits || resultDigits.length === 0) {
      container.innerHTML = '<span class="nodes-placeholder">Result list will form here step by step...</span>';
      return;
    }

    resultDigits.forEach((digit, idx) => {
      const isHead = idx === 0;
      const isLatestCreated = idx === resultDigits.length - 1;

      const itemWrap = document.createElement('div');
      itemWrap.className = 'node-item-wrap node-result';

      const nodeBox = document.createElement('div');
      nodeBox.className = `node-box ${isLatestCreated ? 'node-active' : ''}`;
      nodeBox.title = `Result Node ${idx}: Digit ${digit} (${getPlaceName(idx)})`;

      if (isHead) {
        const headBadge = document.createElement('span');
        headBadge.className = 'node-head-badge';
        headBadge.textContent = 'HEAD';
        nodeBox.appendChild(headBadge);
      }

      const digitSpan = document.createElement('span');
      digitSpan.className = 'node-digit';
      digitSpan.textContent = digit;
      nodeBox.appendChild(digitSpan);

      const placeSpan = document.createElement('span');
      placeSpan.className = 'node-place-label';
      placeSpan.textContent = `10^${idx}`;
      nodeBox.appendChild(placeSpan);

      itemWrap.appendChild(nodeBox);

      // Arrow pointing to next node
      const arrowWrap = document.createElement('div');
      arrowWrap.className = `node-pointer-arrow ${isLatestCreated ? 'arrow-active' : ''}`;
      arrowWrap.innerHTML = `
        <span class="arrow-label">.next</span>
        <div class="arrow-line"></div>
        <div class="arrow-head"></div>
      `;
      itemWrap.appendChild(arrowWrap);

      container.appendChild(itemWrap);
    });

    // Check if total addition is finished to show NULL at result tail
    const isFinished = currentStepIndex === this.calculationResult.totalSteps - 1;
    const nullWrap = document.createElement('div');
    nullWrap.className = 'node-item-wrap';
    nullWrap.innerHTML = `
      <div class="node-null-box" title="${isFinished ? 'Result list successfully terminated' : 'Pending next step'}">
        <span class="node-null-symbol">NULL</span>
        <span class="node-null-label">${isFinished ? 'Complete' : 'Pending...'}</span>
      </div>
    `;
    container.appendChild(nullWrap);
  }

  /* ==========================================================================
     7. Step Navigation & Auto-play
     ========================================================================== */

  nextStep() {
    if (!this.calculationResult) return;
    if (this.currentStep < this.calculationResult.totalSteps - 1) {
      this.currentStep++;
      this.renderStep(this.currentStep);
    } else {
      this.pauseAutoPlay();
    }
  }

  prevStep() {
    if (!this.calculationResult) return;
    if (this.currentStep > 0) {
      this.currentStep--;
      this.renderStep(this.currentStep);
    }
  }

  toggleAutoPlay() {
    if (this.isPlaying) {
      this.pauseAutoPlay();
    } else {
      this.startAutoPlay();
    }
  }

  startAutoPlay() {
    if (!this.calculationResult) return;
    // If at the end, wrap to start
    if (this.currentStep >= this.calculationResult.totalSteps - 1) {
      this.currentStep = 0;
      this.renderStep(this.currentStep);
    }

    this.isPlaying = true;
    this.playIcon.textContent = '⏸';
    this.playText.textContent = 'Pause';
    this.btnStepPlay.classList.add('btn-primary');
    this.btnStepPlay.classList.remove('btn-accent');

    this.playTimer = setInterval(() => {
      if (this.currentStep < this.calculationResult.totalSteps - 1) {
        this.nextStep();
      } else {
        this.pauseAutoPlay();
      }
    }, this.animationSpeed);
  }

  pauseAutoPlay() {
    this.isPlaying = false;
    if (this.playTimer) {
      clearInterval(this.playTimer);
      this.playTimer = null;
    }
    if (this.playIcon) this.playIcon.textContent = '▶';
    if (this.playText) this.playText.textContent = 'Auto Play';
    if (this.btnStepPlay) {
      this.btnStepPlay.classList.remove('btn-primary');
      this.btnStepPlay.classList.add('btn-accent');
    }
  }
}

/* ============================================================================
   8. Automated Unit Test Suite
   Verifies:
   - 342 + 465 = 807
   - 999 + 1 = 1000
   - 0 + 0 = 0
   - 9999 + 99 = 10098 (Unequal list lengths)
   ============================================================================ */

function runLinkedListTestSuite() {
  console.log('%c[LinkedList Lab] Running Core DSA Test Suite...', 'color: #38bdf8; font-weight: bold;');

  const testCases = [
    { num1: '342', num2: '465', expected: '807', desc: 'Standard case (342 + 465 = 807)' },
    { num1: '999', num2: '1', expected: '1000', desc: 'Cascading carry & length expansion (999 + 1 = 1000)' },
    { num1: '0', num2: '0', expected: '0', desc: 'Zero edge case (0 + 0 = 0)' },
    { num1: '9999', num2: '99', expected: '10098', desc: 'Unequal lengths (9999 + 99 = 10098)' },
    { num1: '007', num2: '3', expected: '10', desc: 'Leading zeros normalization (7 + 3 = 10)' }
  ];

  let passedCount = 0;

  testCases.forEach((tc, index) => {
    const l1 = createLinkedListFromNumberString(tc.num1);
    const l2 = createLinkedListFromNumberString(tc.num2);
    const result = addTwoNumbersWithSteps(l1, l2);

    const actual = result.totalSumString;
    const passed = actual === tc.expected;

    if (passed) {
      passedCount++;
      console.log(`%c✔ Test ${index + 1} Passed: ${tc.desc} => Result: ${actual}`, 'color: #10b981;');
    } else {
      console.error(`✖ Test ${index + 1} Failed: ${tc.desc}. Expected: ${tc.expected}, Actual: ${actual}`);
    }
  });

  console.log(
    `%c[LinkedList Lab] Tests Completed: ${passedCount}/${testCases.length} Passed!`,
    passedCount === testCases.length ? 'color: #10b981; font-weight: bold;' : 'color: #f43f5e; font-weight: bold;'
  );

  return passedCount === testCases.length;
}

// Attach test runner globally for inspection / headless verification
window.runLinkedListTestSuite = runLinkedListTestSuite;

/* ============================================================================
   9. Initialization on DOMContentLoaded
   ============================================================================ */

document.addEventListener('DOMContentLoaded', () => {
  // Run verification tests
  runLinkedListTestSuite();

  // Instantiate Application
  window.linkedListLabApp = new LinkedListLabApp();
});
