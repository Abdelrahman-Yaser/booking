import { useState } from "react";
import DateSearch from "../common/DateSearch";
import GuestSearch from "../common/GuestSearch";
import LocationSearch from "../common/LocationSearch";

const MainFilterSearchBox = ({ onSearch }) => {
  const [searchParams, setSearchParams] = useState({
    from: '',
    to: '',
    departDate: new Date().toISOString().split('T')[0],
    returnDate: null,
    passengers: 1,
    cabin: 'economy',
    tripType: 'oneWay',
    directFlights: false,
    withBaggage: true,
    flexibleDates: false,
    maxStops: 2,
    preferredAirlines: [],
    priceRange: { min: '', max: '' },
    departureTimeRange: 'any',
    arrivalTimeRange: 'any'
  });

  const [isSearching, setIsSearching] = useState(false);
  const [errors, setErrors] = useState({});
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

  const validateSearch = () => {
    const newErrors = {};

    if (!searchParams.from) {
      newErrors.from = 'يرجى تحديد مطار المغادرة';
    }

    if (!searchParams.to) {
      newErrors.to = 'يرجى تحديد مطار الوصول';
    }

    if (!searchParams.departDate) {
      newErrors.departDate = 'يرجى تحديد تاريخ السفر';
    }

    if (searchParams.from === searchParams.to) {
      newErrors.general = 'يرجى اختيار مطارات مختلفة للمغادرة والوصول';
    }

    const today = new Date().toISOString().split('T')[0];
    if (searchParams.departDate < today) {
      newErrors.departDate = 'لا يمكن اختيار تاريخ في الماضي';
    }

    if (searchParams.tripType === 'roundTrip' && searchParams.returnDate && searchParams.returnDate < searchParams.departDate) {
      newErrors.returnDate = 'تاريخ العودة يجب أن يكون بعد تاريخ المغادرة';
    }

    if (searchParams.tripType === 'roundTrip' && !searchParams.returnDate) {
      newErrors.returnDate = 'يرجى تحديد تاريخ العودة للرحلة ذهاب وإياب';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSearch = async () => {
    if (!validateSearch()) {
      return;
    }

    setIsSearching(true);
    
    try {
      // Prepare search parameters with all filters for API
      const apiParams = {
        ...searchParams,
        // Convert filters to API format
        filters: {
          directFlights: searchParams.directFlights,
          withBaggage: searchParams.withBaggage,
          flexibleDates: searchParams.flexibleDates,
          maxStops: searchParams.directFlights ? 0 : searchParams.maxStops,
          airlines: searchParams.preferredAirlines,
          priceRange: {
            min: searchParams.priceRange.min ? parseInt(searchParams.priceRange.min) : undefined,
            max: searchParams.priceRange.max ? parseInt(searchParams.priceRange.max) : undefined
          },
          departureTimeRange: searchParams.departureTimeRange,
          arrivalTimeRange: searchParams.arrivalTimeRange
        }
      };

      if (onSearch) {
        await onSearch(apiParams);
      }
    } catch (error) {
      console.error('Search error:', error);
      setErrors({ general: 'حدث خطأ أثناء البحث. يرجى المحاولة مرة أخرى.' });
    } finally {
      setIsSearching(false);
    }
  };

  const updateSearchParam = (key, value) => {
    setSearchParams(prev => ({
      ...prev,
      [key]: value
    }));
    
    if (errors[key]) {
      setErrors(prev => ({
        ...prev,
        [key]: undefined
      }));
    }

    if (key === 'tripType' && value === 'oneWay') {
      setSearchParams(prev => ({
        ...prev,
        returnDate: null
      }));
    }

    // Auto-adjust maxStops based on directFlights
    if (key === 'directFlights') {
      setSearchParams(prev => ({
        ...prev,
        maxStops: value ? 0 : 2
      }));
    }
  };

  const swapLocations = () => {
    setSearchParams(prev => ({
      ...prev,
      from: prev.to,
      to: prev.from
    }));
  };

  const airlines = [
    { code: 'TK', name: 'الخطوط التركية' },
    { code: 'EK', name: 'طيران الإمارات' },
    { code: 'QR', name: 'الخطوط القطرية' },
    { code: 'SV', name: 'الخطوط السعودية' },
    { code: 'MS', name: 'مصر للطيران' },
    { code: 'RJ', name: 'الملكية الأردنية' },
    { code: 'ME', name: 'طيران الشرق الأوسط' },
    { code: 'FZ', name: 'فلاي دبي' }
  ];

  const timeRanges = [
    { value: 'any', label: 'أي وقت' },
    { value: 'morning', label: 'صباحاً (6-12)' },
    { value: 'afternoon', label: 'ظهراً (12-18)' },
    { value: 'evening', label: 'مساءً (18-24)' },
    { value: 'night', label: 'ليلاً (0-6)' }
  ];

  return (
    <div className="search-container-wide">
      {/* Error Messages */}
      {errors.general && (
        <div className="alert alert-danger mb-3 rounded-3">
          <i className="icon-close text-16 me-2"></i>
          {errors.general}
        </div>
      )}

      {/* Ultra Wide Search Box */}
      <div className="ultra-wide-search-box bg-white rounded-4 shadow-lg overflow-hidden">
        
        {/* Trip Type Tabs - Full Width */}
        <div className="trip-tabs-wide d-flex border-bottom">
          <button
            type="button"
            className={`tab-btn-wide ${searchParams.tripType === 'oneWay' ? 'active' : ''}`}
            onClick={() => updateSearchParam('tripType', 'oneWay')}
          >
            <i className="icon-arrow-right text-14 me-2"></i>
            ذهاب فقط
          </button>
          <button
            type="button"
            className={`tab-btn-wide ${searchParams.tripType === 'roundTrip' ? 'active' : ''}`}
            onClick={() => updateSearchParam('tripType', 'roundTrip')}
          >
            <i className="icon-arrow-left-right text-14 me-2"></i>
            ذهاب وإياب
          </button>
          <button
            type="button"
            className={`tab-btn-wide ${searchParams.tripType === 'multiCity' ? 'active' : ''}`}
            onClick={() => updateSearchParam('tripType', 'multiCity')}
          >
            <i className="icon-route text-14 me-2"></i>
            متعدد المدن
          </button>
          
          {/* Advanced Filters Toggle */}
          <div className="ms-auto">
            <button
              type="button"
              className={`advanced-toggle-btn ${showAdvancedFilters ? 'active' : ''}`}
              onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
            >
              <i className="icon-filter text-14 me-2"></i>
              فلاتر متقدمة
              <i className={`icon-chevron-${showAdvancedFilters ? 'up' : 'down'} text-12 ms-2`}></i>
            </button>
          </div>
        </div>

        {/* Main Search Row - Ultra Wide */}
        <div className="search-row-wide p-4">
          <div className="d-flex align-items-end gap-3">
            
            {/* From Location - Wider */}
            <div className="search-field-wide">
              <div className={`location-input-wide ${errors.from ? 'error' : ''}`}>
                <label className="field-label-wide">
                  <i className="icon-plane-departure text-16 me-2 text-primary"></i>
                  من أين؟
                </label>
                <div className="searchMenu-wrapper" style={{ position: 'relative', zIndex: 1000 }}>
                  <LocationSearch 
                    title=""
                    value={searchParams.from}
                    onChange={(value) => updateSearchParam('from', value)}
                    placeholder="اختر مطار المغادرة"
                    className="w-100"
                    style={{ zIndex: 1001 }}
                  />
                </div>
              </div>
              {errors.from && <div className="error-text-wide">{errors.from}</div>}
            </div>

            {/* Swap Button - Enhanced */}
            <div className="swap-btn-container-wide">
              <button
                type="button"
                className="swap-btn-wide"
                onClick={swapLocations}
                title="تبديل المطارات"
              >
                <i className="icon-swap text-18"></i>
              </button>
            </div>

            {/* To Location - Wider */}
            <div className="search-field-wide">
              <div className={`location-input-wide ${errors.to ? 'error' : ''}`}>
                <label className="field-label-wide">
                  <i className="icon-plane-arrival text-16 me-2 text-success"></i>
                  إلى أين؟
                </label>
                <div className="searchMenu-wrapper" style={{ position: 'relative', zIndex: 1000 }}>
                  <LocationSearch 
                    title=""
                    value={searchParams.to}
                    onChange={(value) => updateSearchParam('to', value)}
                    placeholder="اختر مطار الوصول"
                    className="w-100"
                    style={{ zIndex: 1001 }}
                  />
                </div>
              </div>
              {errors.to && <div className="error-text-wide">{errors.to}</div>}
            </div>

            {/* Departure Date - Enhanced */}
            <div className="search-field-wide">
              <div className={`date-input-wide ${errors.departDate ? 'error' : ''}`}>
                <label className="field-label-wide">
                  <i className="icon-calendar text-16 me-2 text-info"></i>
                  تاريخ المغادرة
                </label>
                <DateSearch 
                  value={searchParams.departDate}
                  onChange={(value) => updateSearchParam('departDate', value)}
                />
              </div>
              {errors.departDate && <div className="error-text-wide">{errors.departDate}</div>}
            </div>

            {/* Return Date - Enhanced */}
            {searchParams.tripType === 'roundTrip' && (
              <div className="search-field-wide">
                <div className={`date-input-wide ${errors.returnDate ? 'error' : ''}`}>
                  <label className="field-label-wide">
                    <i className="icon-calendar text-16 me-2 text-warning"></i>
                    تاريخ العودة
                  </label>
                  <DateSearch 
                    value={searchParams.returnDate}
                    onChange={(value) => updateSearchParam('returnDate', value)}
                    placeholder="اختر تاريخ العودة"
                  />
                </div>
                {errors.returnDate && <div className="error-text-wide">{errors.returnDate}</div>}
              </div>
            )}

            {/* Passengers & Cabin - Enhanced */}
            <div className="search-field-wide">
              <label className="field-label-wide">
                <i className="icon-person text-16 me-2 text-purple"></i>
                المسافرون والدرجة
              </label>
              <GuestSearch 
                value={searchParams.passengers}
                onChange={(value) => updateSearchParam('passengers', value)}
                cabin={searchParams.cabin}
                onCabinChange={(value) => updateSearchParam('cabin', value)}
              />
            </div>

            {/* Search Button - Enhanced */}
            <div className="search-btn-container-wide">
              <button 
                className={`search-btn-wide ${isSearching ? 'loading' : ''}`}
                onClick={handleSearch}
                disabled={isSearching}
              >
                {isSearching ? (
                  <>
                    <div className="spinner-wide"></div>
                    جاري البحث...
                  </>
                ) : (
                  <>
                    <i className="icon-search text-20" />
                    البحث عن الرحلات
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Quick Filters Row - Always Visible */}
        <div className="quick-filters-row bg-light p-3 border-top">
          <div className="d-flex align-items-center justify-content-between">
            
            {/* Left Quick Filters */}
            <div className="d-flex align-items-center gap-4">
              <label className="filter-checkbox-wide">
                <input
                  type="checkbox"
                  checked={searchParams.directFlights}
                  onChange={(e) => updateSearchParam('directFlights', e.target.checked)}
                />
                <span className="checkmark-wide"></span>
                <span className="filter-text-wide">
                  <i className="icon-plane text-16 me-2 text-primary"></i>
                  رحلات مباشرة فقط
                </span>
              </label>

              <label className="filter-checkbox-wide">
                <input
                  type="checkbox"
                  checked={searchParams.withBaggage}
                  onChange={(e) => updateSearchParam('withBaggage', e.target.checked)}
                />
                <span className="checkmark-wide"></span>
                <span className="filter-text-wide">
                  <i className="icon-luggage text-16 me-2 text-success"></i>
                  حقائب مجانية
                </span>
              </label>

              <label className="filter-checkbox-wide">
                <input
                  type="checkbox"
                  checked={searchParams.flexibleDates}
                  onChange={(e) => updateSearchParam('flexibleDates', e.target.checked)}
                />
                <span className="checkmark-wide"></span>
                <span className="filter-text-wide">
                  <i className="icon-calendar text-16 me-2 text-warning"></i>
                  تواريخ مرنة (±3 أيام)
                </span>
              </label>
            </div>

            {/* Right Info */}
            <div className="d-flex align-items-center gap-4 text-sm">
              <span className="info-badge">
                <i className="icon-check text-success me-1"></i>
                مدعوم بـ Flymefy
              </span>
              <span className="info-badge">
                <i className="icon-clock text-primary me-1"></i>
                أسعار محدثة لحظياً
              </span>
              <span className="info-badge">
                <i className="icon-plane text-info me-1"></i>
                600+ شركة طيران
              </span>
            </div>
          </div>
        </div>

        {/* Advanced Filters Section - Collapsible */}
        {showAdvancedFilters && (
          <div className="advanced-filters-section bg-white border-top p-4">
            <div className="row g-4">
              
              {/* Price Range */}
              <div className="col-md-3">
                <label className="field-label-wide mb-2">
                  <i className="icon-dollar text-16 me-2 text-success"></i>
                  نطاق السعر (USD)
                </label>
                <div className="d-flex gap-2">
                  <input
                    type="number"
                    className="form-control form-control-sm"
                    placeholder="من"
                    value={searchParams.priceRange.min}
                    onChange={(e) => updateSearchParam('priceRange', {
                      ...searchParams.priceRange,
                      min: e.target.value
                    })}
                  />
                  <input
                    type="number"
                    className="form-control form-control-sm"
                    placeholder="إلى"
                    value={searchParams.priceRange.max}
                    onChange={(e) => updateSearchParam('priceRange', {
                      ...searchParams.priceRange,
                      max: e.target.value
                    })}
                  />
                </div>
              </div>

              {/* Max Stops */}
              <div className="col-md-2">
                <label className="field-label-wide mb-2">
                  <i className="icon-route text-16 me-2 text-info"></i>
                  عدد التوقفات
                </label>
                <select
                  className="form-select form-select-sm"
                  value={searchParams.maxStops}
                  onChange={(e) => updateSearchParam('maxStops', parseInt(e.target.value))}
                  disabled={searchParams.directFlights}
                >
                  <option value={0}>مباشرة</option>
                  <option value={1}>توقف واحد</option>
                  <option value={2}>توقفان</option>
                  <option value={3}>ثلاث توقفات</option>
                </select>
              </div>

              {/* Departure Time */}
              <div className="col-md-2">
                <label className="field-label-wide mb-2">
                  <i className="icon-clock text-16 me-2 text-primary"></i>
                  وقت المغادرة
                </label>
                <select
                  className="form-select form-select-sm"
                  value={searchParams.departureTimeRange}
                  onChange={(e) => updateSearchParam('departureTimeRange', e.target.value)}
                >
                  {timeRanges.map(range => (
                    <option key={range.value} value={range.value}>
                      {range.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Arrival Time */}
              <div className="col-md-2">
                <label className="field-label-wide mb-2">
                  <i className="icon-clock text-16 me-2 text-warning"></i>
                  وقت الوصول
                </label>
                <select
                  className="form-select form-select-sm"
                  value={searchParams.arrivalTimeRange}
                  onChange={(e) => updateSearchParam('arrivalTimeRange', e.target.value)}
                >
                  {timeRanges.map(range => (
                    <option key={range.value} value={range.value}>
                      {range.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Preferred Airlines */}
              <div className="col-md-3">
                <label className="field-label-wide mb-2">
                  <i className="icon-plane text-16 me-2 text-purple"></i>
                  شركات الطيران المفضلة
                </label>
                <div className="airlines-grid">
                  {airlines.map(airline => (
                    <label key={airline.code} className="airline-checkbox">
                      <input
                        type="checkbox"
                        checked={searchParams.preferredAirlines.includes(airline.code)}
                        onChange={(e) => {
                          const newAirlines = e.target.checked
                            ? [...searchParams.preferredAirlines, airline.code]
                            : searchParams.preferredAirlines.filter(code => code !== airline.code);
                          updateSearchParam('preferredAirlines', newAirlines);
                        }}
                      />
                      <span className="airline-name">{airline.name}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            {/* Filter Actions */}
            <div className="d-flex justify-content-between align-items-center mt-4 pt-3 border-top">
              <div className="filter-summary text-sm text-muted">
                {searchParams.preferredAirlines.length > 0 && (
                  <span className="me-3">
                    <i className="icon-plane text-12 me-1"></i>
                    {searchParams.preferredAirlines.length} شركة طيران محددة
                  </span>
                )}
                {(searchParams.priceRange.min || searchParams.priceRange.max) && (
                  <span className="me-3">
                    <i className="icon-dollar text-12 me-1"></i>
                    نطاق سعر محدد
                  </span>
                )}
                {searchParams.departureTimeRange !== 'any' && (
                  <span className="me-3">
                    <i className="icon-clock text-12 me-1"></i>
                    وقت مغادرة محدد
                  </span>
                )}
              </div>
              
              <button
                type="button"
                className="btn btn-outline-secondary btn-sm"
                onClick={() => {
                  setSearchParams(prev => ({
                    ...prev,
                    maxStops: 2,
                    preferredAirlines: [],
                    priceRange: { min: '', max: '' },
                    departureTimeRange: 'any',
                    arrivalTimeRange: 'any'
                  }));
                }}
              >
                <i className="icon-refresh text-12 me-1"></i>
                إعادة تعيين الفلاتر
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MainFilterSearchBox;
