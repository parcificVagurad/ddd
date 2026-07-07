document.addEventListener('DOMContentLoaded', () => {
  // Initialize Lucide Icons
  lucide.createIcons();

  // ----------------------------------------------------
  // 1. Navigation & Tab Switching
  // ----------------------------------------------------
  const navItems = document.querySelectorAll('.nav-item');
  const mobileNavItems = document.querySelectorAll('.mobile-nav-item');
  const calcPanels = document.querySelectorAll('.calc-panel');
  const menuToggleBtn = document.getElementById('menuToggleBtn');
  const mobileNav = document.getElementById('mobileNav');

  function switchTab(targetId) {
    // Hide all panels
    calcPanels.forEach(panel => {
      panel.classList.remove('active');
      panel.style.display = 'none';
    });

    // Show target panel with animation
    const targetPanel = document.getElementById(targetId);
    if (targetPanel) {
      targetPanel.style.display = 'flex';
      setTimeout(() => {
        targetPanel.classList.add('active');
      }, 50);
    }

    // Update active class on nav items
    navItems.forEach(item => {
      if (item.getAttribute('data-target') === targetId) {
        item.classList.add('active');
      } else {
        item.classList.remove('active');
      }
    });

    mobileNavItems.forEach(item => {
      if (item.getAttribute('data-target') === targetId) {
        item.classList.add('active');
      } else {
        item.classList.remove('active');
      }
    });
  }

  // Sidebar navigation click
  navItems.forEach(item => {
    item.addEventListener('click', () => {
      const target = item.getAttribute('data-target');
      switchTab(target);
    });
  });

  // Mobile navigation click
  mobileNavItems.forEach(item => {
    item.addEventListener('click', () => {
      const target = item.getAttribute('data-target');
      switchTab(target);
      mobileNav.classList.remove('open');
      menuToggleBtn.querySelector('i').setAttribute('data-lucide', 'menu');
      lucide.createIcons();
    });
  });

  // Mobile menu toggle
  menuToggleBtn.addEventListener('click', () => {
    const isOpen = mobileNav.classList.toggle('open');
    const iconName = isOpen ? 'x' : 'menu';
    menuToggleBtn.querySelector('i').setAttribute('data-lucide', iconName);
    lucide.createIcons();
  });


  // ----------------------------------------------------
  // 2. BMI Calculator Logic
  // ----------------------------------------------------
  const bmiHeightSlider = document.getElementById('bmi-height');
  const bmiHeightNum = document.getElementById('bmi-height-num');
  const bmiWeightSlider = document.getElementById('bmi-weight');
  const bmiWeightNum = document.getElementById('bmi-weight-num');
  const bmiMuscleSlider = document.getElementById('bmi-muscle');
  const bmiMuscleNum = document.getElementById('bmi-muscle-num');
  const bmiGenderRadios = document.getElementsByName('bmi-gender');
  
  const bmiValEl = document.getElementById('bmi-val');
  const bmiStatusTextEl = document.getElementById('bmi-status-text');
  const bmiPointer = document.getElementById('bmi-pointer');
  const bmiAnalysisDesc = document.getElementById('bmi-analysis-desc');
  const bmiStandardWeight = document.getElementById('bmi-standard-weight');
  const bmiHealthyRange = document.getElementById('bmi-healthy-range');

  const musclePercentVal = document.getElementById('muscle-percent-val');
  const muscleStatusText = document.getElementById('muscle-status-text');
  const bodyTypeVal = document.getElementById('body-type-val');
  const muscleHealthyRange = document.getElementById('muscle-healthy-range');

  function getBmiPercentage(bmi) {
    if (bmi < 18.5) {
      // Underweight: Map 15 ~ 18.5 to 0% ~ 25%
      const p = ((bmi - 15) / 3.5) * 25;
      return Math.max(0, p);
    } else if (bmi < 23) {
      // Normal: Map 18.5 ~ 23 to 25% ~ 50%
      return 25 + ((bmi - 18.5) / 4.5) * 25;
    } else if (bmi < 25) {
      // Overweight: Map 23 ~ 25 to 50% ~ 65%
      return 50 + ((bmi - 23) / 2) * 15;
    } else if (bmi < 30) {
      // Obese: Map 25 ~ 30 to 65% ~ 80%
      return 65 + ((bmi - 25) / 5) * 15;
    } else {
      // Extremely Obese: Map 30 ~ 40 to 80% ~ 100%
      const p = 80 + ((bmi - 30) / 10) * 20;
      return Math.min(100, p);
    }
  }

  function calculateBMI() {
    const height = parseFloat(bmiHeightNum.value) || 175;
    const weight = parseFloat(bmiWeightNum.value) || 70;
    const muscle = parseFloat(bmiMuscleNum.value) || 30;
    
    // Check gender
    let gender = 'male';
    for (const radio of bmiGenderRadios) {
      if (radio.checked) {
        gender = radio.value;
        break;
      }
    }

    const heightM = height / 100;
    const bmi = weight / (heightM * heightM);
    const bmiRounded = bmi.toFixed(1);

    // Update score text
    bmiValEl.textContent = bmiRounded;

    // Remove old classes
    bmiStatusTextEl.className = 'bmi-status';

    let status = '';
    let statusClass = '';

    if (bmi < 18.5) {
      status = '저체중';
      statusClass = 'underweight';
    } else if (bmi < 23) {
      status = '정상';
      statusClass = 'normal';
    } else if (bmi < 25) {
      status = '과체중';
      statusClass = 'overweight';
    } else if (bmi < 30) {
      status = '비만';
      statusClass = 'obese';
    } else {
      status = '고도비만';
      statusClass = 'extremely-obese';
    }

    // Set UI values
    bmiStatusTextEl.textContent = status;
    bmiStatusTextEl.classList.add(statusClass);

    // Standard weight formulas: Men: H^2 * 22, Women: H^2 * 21
    const standardWeight = (heightM * heightM * (gender === 'male' ? 22 : 21)).toFixed(1);
    bmiStandardWeight.textContent = `${standardWeight} kg`;

    // Normal range: BMI 18.5 ~ 22.9
    const minWeight = (heightM * heightM * 18.5).toFixed(1);
    const maxWeight = (heightM * heightM * 22.9).toFixed(1);
    bmiHealthyRange.textContent = `${minWeight} kg ~ ${maxWeight} kg`;

    // Move gauge pointer
    const pointerPercent = getBmiPercentage(bmi);
    bmiPointer.style.left = `${pointerPercent}%`;

    // ----------------------------------------------------
    // Skeletal Muscle Mass (골격근량) Calculations
    // ----------------------------------------------------
    const smmPercent = (muscle / weight) * 100;
    musclePercentVal.textContent = `${smmPercent.toFixed(1)}%`;

    // Normal SMM% Range: Male 37~47%, Female 28~36%
    const smmMin = gender === 'male' ? 37 : 28;
    const smmMax = gender === 'male' ? 47 : 36;
    muscleHealthyRange.textContent = `${smmMin}.0% ~ ${smmMax}.0%`;

    let muscleStatus = '표준';
    let muscleStatusClass = 'standard';
    
    if (smmPercent < smmMin) {
      muscleStatus = '부족';
      muscleStatusClass = 'under';
    } else if (smmPercent > smmMax) {
      muscleStatus = '우수';
      muscleStatusClass = 'over';
    }

    muscleStatusText.textContent = muscleStatus;
    muscleStatusText.className = `muscle-status ${muscleStatusClass}`;

    // Body Composition Type & Combined Analysis
    let bodyType = '';
    let description = '';

    if (bmi < 18.5) {
      if (muscleStatusClass === 'under') {
        bodyType = '저체중 허약형';
        description = '신체질량지수가 표준 이하이고 골격근량도 부족합니다. 균형 잡힌 영양 섭취와 점진적인 근력 운동을 권장합니다.';
      } else {
        bodyType = '저체중 건강형';
        description = '체중은 가벼운 편이나, 골격근 비중이 표준 이상입니다. 체력은 우수할 수 있으나 적정 체중 유지를 위해 균형 잡힌 식단을 추천합니다.';
      }
    } else if (bmi < 23) {
      if (muscleStatusClass === 'under') {
        bodyType = '근육 부족형 (마른 비만)';
        description = '체중은 정상 범위이나 골격근량이 부족하여 체지방률이 높을 수 있습니다. 단백질 섭취를 늘리고 근력 운동을 통해 기초대사량을 높여야 합니다.';
      } else if (muscleStatusClass === 'standard') {
        bodyType = '정상 건강형';
        description = '체중과 골격근 비율 모두 이상적인 표준 범위입니다. 균형 잡힌 식사와 운동 습관을 꾸준히 유지하세요!';
      } else {
        bodyType = '근육질 건강형';
        description = '정상 체중 범위이면서 근육 발달이 매우 우수한 탄탄하고 건강한 신체 상태입니다.';
      }
    } else if (bmi < 25) {
      if (muscleStatusClass === 'under') {
        bodyType = '과체중 지방형';
        description = '체중이 표준을 초과하고 근육량이 부족한 상태입니다. 체지방 감량과 근력 강화 운동을 병행하는 것이 좋습니다.';
      } else if (muscleStatusClass === 'standard') {
        bodyType = '과체중 표준형';
        description = '체중이 다소 과한 편이나 근육 비율은 적절합니다. 식사 속도 조절과 유산소 운동으로 조절이 수월한 상태입니다.';
      } else {
        bodyType = '과체중 근육형 (운동선수형)';
        description = '골격근이 아주 잘 발달하여 체중이 과체중으로 분류된 상태입니다. 체성분 분석상 매우 건강하므로 체중에 연연하실 필요가 없습니다.';
      }
    } else {
      if (muscleStatusClass === 'over') {
        bodyType = '근육형 비만 (벌크업형)';
        description = '골격근량이 매우 높은 고근육성 체형입니다. 건강상 문제는 적으나, 관절 부담 예방을 위해 유산소 운동 비중을 늘려 심폐 지구력을 보강하세요.';
      } else {
        bodyType = '지방성 비만형';
        description = '체중 대비 근육 비율이 부족하여 성인병 위험이 높아질 수 있습니다. 체계적인 유산소 운동과 더불어 코어 및 대근육 강화 운동이 필요합니다.';
      }
    }

    bodyTypeVal.textContent = bodyType;
    bmiAnalysisDesc.textContent = description;
  }

  // Handle sync between inputs and sliders for BMI
  function setupSyncInput(slider, input, callback) {
    slider.addEventListener('input', () => {
      input.value = slider.value;
      callback();
    });
    input.addEventListener('input', () => {
      let val = parseFloat(input.value);
      const min = parseFloat(input.min);
      const max = parseFloat(input.max);
      if (isNaN(val)) return;
      if (val < min) val = min;
      if (val > max) val = max;
      slider.value = val;
      callback();
    });
  }

  setupSyncInput(bmiHeightSlider, bmiHeightNum, calculateBMI);
  setupSyncInput(bmiWeightSlider, bmiWeightNum, calculateBMI);
  setupSyncInput(bmiMuscleSlider, bmiMuscleNum, calculateBMI);
  bmiGenderRadios.forEach(radio => radio.addEventListener('change', calculateBMI));
  
  // Run initial BMI calculation
  calculateBMI();


  // ----------------------------------------------------
  // 3. Dutch Pay / Tip Calculator Logic
  // ----------------------------------------------------
  const dutchTotalInput = document.getElementById('dutch-total');
  const dutchPeopleInput = document.getElementById('dutch-people');
  const dutchTipInput = document.getElementById('dutch-tip');
  const dutchRoundRadios = document.getElementsByName('dutch-round');
  const dutchPerPersonEl = document.getElementById('dutch-per-person');
  const dutchCalcBaseEl = document.getElementById('dutch-calc-base');
  const dutchCalcTipEl = document.getElementById('dutch-calc-tip');
  const dutchCalcTotalEl = document.getElementById('dutch-calc-total');
  const dutchRemainderEl = document.getElementById('dutch-remainder');
  const dutchShareMsgEl = document.getElementById('dutch-share-msg');
  const dutchCopyBtn = document.getElementById('dutch-copy-btn');

  function calculateDutchPay() {
    const baseTotal = Math.max(0, parseFloat(dutchTotalInput.value) || 0);
    const people = Math.max(1, parseInt(dutchPeopleInput.value) || 1);
    const tipPercent = Math.max(0, parseFloat(dutchTipInput.value) || 0);
    
    let roundingUnit = 1;
    for (const radio of dutchRoundRadios) {
      if (radio.checked) {
        roundingUnit = parseInt(radio.value);
        break;
      }
    }

    const tipAmount = Math.round(baseTotal * (tipPercent / 100));
    const totalAmount = baseTotal + tipAmount;
    
    // Per person calculations
    const rawSplit = totalAmount / people;
    // Floor division to nearest rounding unit
    const perPersonSplit = Math.floor(rawSplit / roundingUnit) * roundingUnit;
    const totalPaidByOthers = perPersonSplit * people;
    const remainder = totalAmount - totalPaidByOthers;

    // Update values
    dutchPerPersonEl.textContent = perPersonSplit.toLocaleString();
    dutchCalcBaseEl.textContent = `${baseTotal.toLocaleString()} 원`;
    dutchCalcTipEl.textContent = `${tipAmount.toLocaleString()} 원`;
    dutchCalcTotalEl.textContent = `${totalAmount.toLocaleString()} 원`;
    dutchRemainderEl.textContent = `${remainder.toLocaleString()} 원`;

    // Update sharing message text
    let msg = `총 정산 금액: ₩${totalAmount.toLocaleString()}`;
    if (tipAmount > 0) {
      msg += ` (음식값 ${baseTotal.toLocaleString()}원 + 팁 ${tipAmount.toLocaleString()}원)`;
    }
    msg += `\n인원수: ${people}명\n1인당 정산 금액: ₩${perPersonSplit.toLocaleString()}원`;
    if (remainder > 0 && roundingUnit > 1) {
      msg += `\n(절사 처리로 발생한 차액 ${remainder.toLocaleString()}원은 방장이 합산하여 정산합니다.)`;
    }
    dutchShareMsgEl.innerText = msg;
  }

  // Bind input updates
  dutchTotalInput.addEventListener('input', calculateDutchPay);
  dutchPeopleInput.addEventListener('input', calculateDutchPay);
  dutchTipInput.addEventListener('input', calculateDutchPay);
  dutchRoundRadios.forEach(radio => radio.addEventListener('change', calculateDutchPay));

  // Copy share message logic
  dutchCopyBtn.addEventListener('click', () => {
    const textToCopy = dutchShareMsgEl.innerText;
    navigator.clipboard.writeText(textToCopy).then(() => {
      // Visual feedback
      const originalHtml = dutchCopyBtn.innerHTML;
      dutchCopyBtn.innerHTML = '<i data-lucide="check"></i> <span>복사 완료!</span>';
      lucide.createIcons();
      dutchCopyBtn.classList.add('btn-success');

      setTimeout(() => {
        dutchCopyBtn.innerHTML = originalHtml;
        lucide.createIcons();
        dutchCopyBtn.classList.remove('btn-success');
      }, 2000);
    }).catch(err => {
      console.error('Failed to copy text: ', err);
    });
  });

  // Run initial Dutch pay calculation
  calculateDutchPay();


  // ----------------------------------------------------
  // 4. Savings / Interest Calculator Logic
  // ----------------------------------------------------
  const interestProductRadios = document.getElementsByName('interest-product');
  const interestAmountInput = document.getElementById('interest-amount');
  const interestRateInput = document.getElementById('interest-rate');
  const interestPeriodInput = document.getElementById('interest-period');
  const interestTypeRadios = document.getElementsByName('interest-type');
  const interestTaxSelect = document.getElementById('interest-tax');
  const amountLabel = document.getElementById('amount-label');
  
  const interestTotalNetEl = document.getElementById('interest-total-net');
  const interestTotalPrincipalEl = document.getElementById('interest-total-principal');
  const interestTotalGrossInterestEl = document.getElementById('interest-total-gross-interest');
  const interestTotalTaxEl = document.getElementById('interest-total-tax');
  const interestAnalysisText = document.getElementById('interest-analysis-text');

  // Change amount label depending on product type
  interestProductRadios.forEach(radio => {
    radio.addEventListener('change', (e) => {
      const parentLabelBtn = e.target.closest('.sub-tab-btn');
      // Update sub tab active styling
      document.querySelectorAll('.tab-sub-selector .sub-tab-btn').forEach(btn => {
        btn.classList.remove('active');
      });
      parentLabelBtn.classList.add('active');

      if (e.target.value === 'deposit') {
        amountLabel.textContent = '예금액 (목돈)';
        if (interestAmountInput.value === '100000') {
          // Adjust defaults when toggling between scales if necessary
          interestAmountInput.value = '10000000';
        }
      } else {
        amountLabel.textContent = '월 납입금 (적금)';
        if (interestAmountInput.value === '10000000') {
          interestAmountInput.value = '500000';
        }
      }
      calculateInterest();
    });
  });

  function calculateInterest() {
    const product = document.querySelector('input[name="interest-product"]:checked').value;
    const amount = Math.max(0, parseFloat(interestAmountInput.value) || 0);
    const annualRate = (Math.max(0, parseFloat(interestRateInput.value) || 0)) / 100;
    const months = Math.max(1, parseInt(interestPeriodInput.value) || 1);
    const type = document.querySelector('input[name="interest-type"]:checked').value;
    const taxRate = parseFloat(interestTaxSelect.value) / 100;

    let principal = 0;
    let grossInterest = 0;

    if (product === 'deposit') {
      // 1. Deposit (예금)
      principal = amount;
      if (type === 'simple') {
        // Simple Interest: P * r * (t / 12)
        grossInterest = amount * annualRate * (months / 12);
      } else {
        // Compound Interest: P * ((1 + r) ^ (t / 12) - 1)
        grossInterest = amount * (Math.pow(1 + annualRate, months / 12) - 1);
      }
    } else {
      // 2. Savings (적금)
      principal = amount * months;
      if (type === 'simple') {
        // Monthly Simple Interest
        // Interest = Monthly Deposit * (Rate / 12) * (Months * (Months + 1) / 2)
        grossInterest = amount * (annualRate / 12) * (months * (months + 1) / 2);
      } else {
        // Monthly Compound Interest
        // S = A * (1 + i) * ((1 + i)^n - 1) / i
        const monthlyRate = annualRate / 12;
        if (monthlyRate === 0) {
          grossInterest = 0;
        } else {
          const totalValue = amount * (1 + monthlyRate) * (Math.pow(1 + monthlyRate, months) - 1) / monthlyRate;
          grossInterest = totalValue - principal;
        }
      }
    }

    grossInterest = Math.round(grossInterest);
    const taxAmount = Math.round(grossInterest * taxRate);
    const netInterest = grossInterest - taxAmount;
    const netTotal = principal + netInterest;

    // Update outputs
    interestTotalNetEl.textContent = netTotal.toLocaleString();
    interestTotalPrincipalEl.textContent = `${principal.toLocaleString()} 원`;
    interestTotalGrossInterestEl.textContent = `${grossInterest.toLocaleString()} 원`;
    interestTotalTaxEl.textContent = `${taxAmount.toLocaleString()} 원`;

    // Dynamic descriptive texts
    let desc = '';
    const rateText = (annualRate * 100).toFixed(1);
    const taxSelectText = interestTaxSelect.options[interestTaxSelect.selectedIndex].text;
    const productKorean = product === 'deposit' ? '예금' : '적금';
    const typeKorean = type === 'simple' ? '단리' : '연복리';

    desc = `${productKorean} 상품으로 매월/총 ${amount.toLocaleString()}원을 금리 ${rateText}%, ${months}개월 동안 ${typeKorean}식으로 거치/납입했을 때 만기 결과입니다.\n\n`;
    desc += `세전 이자 ${grossInterest.toLocaleString()}원에서 ${taxSelectText}에 해당하는 세금 ${taxAmount.toLocaleString()}원을 제한 세후 최종 실수령액은 ₩${netTotal.toLocaleString()}원입니다.`;
    
    interestAnalysisText.textContent = desc;
  }

  // Bind inputs
  interestAmountInput.addEventListener('input', calculateInterest);
  interestRateInput.addEventListener('input', calculateInterest);
  interestPeriodInput.addEventListener('input', calculateInterest);
  interestTypeRadios.forEach(radio => radio.addEventListener('change', calculateInterest));
  interestTaxSelect.addEventListener('change', calculateInterest);

  // Run initial interest calculation
  calculateInterest();


  // ----------------------------------------------------
  // 5. Unit Converter Logic
  // ----------------------------------------------------
  const unitTypeBtns = document.querySelectorAll('.unit-type-btn');
  const unitGroupPanels = document.querySelectorAll('.unit-group-panel');

  // Switch conversion category tab
  unitTypeBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const type = btn.getAttribute('data-type');
      
      // Update tabs active state
      unitTypeBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      // Update groups active state
      unitGroupPanels.forEach(p => {
        p.classList.remove('active');
        p.style.display = 'none';
      });

      const activeGroup = document.getElementById(`unit-${type}-group`);
      if (activeGroup) {
        activeGroup.style.display = 'block';
        setTimeout(() => {
          activeGroup.classList.add('active');
        }, 50);
      }
    });
  });

  // Utility to round decimals neatly
  function formatUnit(val) {
    if (isNaN(val)) return '';
    // If it's a whole number or close to it, keep it simple, otherwise 3 decimals
    const rounded = Math.round(val * 10000) / 10000;
    return parseFloat(rounded.toString()); // Strip trailing zeros in decimals
  }

  // --- 넓이 변환 (Pyung ↔ M2) ---
  const areaPyeong = document.getElementById('area-pyeong');
  const areaM2 = document.getElementById('area-m2');
  const PY_TO_M2 = 3.305785;

  areaPyeong.addEventListener('input', (e) => {
    const val = parseFloat(e.target.value);
    if (isNaN(val)) { areaM2.value = ''; return; }
    areaM2.value = formatUnit(val * PY_TO_M2);
  });

  areaM2.addEventListener('input', (e) => {
    const val = parseFloat(e.target.value);
    if (isNaN(val)) { areaPyeong.value = ''; return; }
    areaPyeong.value = formatUnit(val / PY_TO_M2);
  });

  // --- 길이 변환 (cm ↔ inch ↔ feet) ---
  const lengthCm = document.getElementById('length-cm');
  const lengthInch = document.getElementById('length-inch');
  const lengthFeet = document.getElementById('length-feet');

  lengthCm.addEventListener('input', (e) => {
    const val = parseFloat(e.target.value);
    if (isNaN(val)) {
      lengthInch.value = '';
      lengthFeet.value = '';
      return;
    }
    lengthInch.value = formatUnit(val / 2.54);
    lengthFeet.value = formatUnit(val / 30.48);
  });

  lengthInch.addEventListener('input', (e) => {
    const val = parseFloat(e.target.value);
    if (isNaN(val)) {
      lengthCm.value = '';
      lengthFeet.value = '';
      return;
    }
    lengthCm.value = formatUnit(val * 2.54);
    lengthFeet.value = formatUnit(val / 12);
  });

  lengthFeet.addEventListener('input', (e) => {
    const val = parseFloat(e.target.value);
    if (isNaN(val)) {
      lengthCm.value = '';
      lengthInch.value = '';
      return;
    }
    lengthCm.value = formatUnit(val * 30.48);
    lengthInch.value = formatUnit(val * 12);
  });

  // --- 무게 변환 (kg ↔ lb ↔ oz) ---
  const weightKg = document.getElementById('weight-kg');
  const weightLb = document.getElementById('weight-lb');
  const weightOz = document.getElementById('weight-oz');
  const KG_TO_LB = 2.20462262;
  const LB_TO_OZ = 16;

  weightKg.addEventListener('input', (e) => {
    const val = parseFloat(e.target.value);
    if (isNaN(val)) {
      weightLb.value = '';
      weightOz.value = '';
      return;
    }
    const lbVal = val * KG_TO_LB;
    weightLb.value = formatUnit(lbVal);
    weightOz.value = formatUnit(lbVal * LB_TO_OZ);
  });

  weightLb.addEventListener('input', (e) => {
    const val = parseFloat(e.target.value);
    if (isNaN(val)) {
      weightKg.value = '';
      weightOz.value = '';
      return;
    }
    weightKg.value = formatUnit(val / KG_TO_LB);
    weightOz.value = formatUnit(val * LB_TO_OZ);
  });

  weightOz.addEventListener('input', (e) => {
    const val = parseFloat(e.target.value);
    if (isNaN(val)) {
      weightKg.value = '';
      weightLb.value = '';
      return;
    }
    const lbVal = val / LB_TO_OZ;
    weightLb.value = formatUnit(lbVal);
    weightKg.value = formatUnit(lbVal / KG_TO_LB);
  });

  // --- 온도 변환 (°C ↔ °F) ---
  const tempCelsius = document.getElementById('temp-celsius');
  const tempFahrenheit = document.getElementById('temp-fahrenheit');

  tempCelsius.addEventListener('input', (e) => {
    const val = parseFloat(e.target.value);
    if (isNaN(val)) { tempFahrenheit.value = ''; return; }
    tempFahrenheit.value = formatUnit(val * 1.8 + 32);
  });

  tempFahrenheit.addEventListener('input', (e) => {
    const val = parseFloat(e.target.value);
    if (isNaN(val)) { tempCelsius.value = ''; return; }
    tempCelsius.value = formatUnit((val - 32) / 1.8);
  });
});
