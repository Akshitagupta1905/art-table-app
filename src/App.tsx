import { useRef, useState, useEffect } from 'react';
import { DataTable, DataTablePageEvent } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { OverlayPanel } from 'primereact/overlaypanel';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Tag } from 'primereact/tag';
import { Artwork, ApiResponse } from './types';
import './App.css';

const PAGE_SIZE = 12;
const API = 'https://api.artic.edu/api/v1/artworks';
const FIELDS = 'id,title,place_of_origin,artist_display,inscriptions,date_start,date_end';

export default function App() {
  // Table data
  const [items, setItems] = useState<Artwork[]>([]);
  const [totalItems, setTotalItems] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  // Selection state (human-style)
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());
  const [bulkLimit, setBulkLimit] = useState(0);
  const [removedFromBulk, setRemovedFromBulk] = useState<Set<number>>(new Set());

  const panelRef = useRef<OverlayPanel>(null);
  const [bulkNumber, setBulkNumber] = useState('');

  // Fetch artworks from API
  const loadData = async (pageNum: number) => {
    setIsLoading(true);
    try {
      const response = await fetch(`${API}?page=${pageNum}&limit=${PAGE_SIZE}&fields=${FIELDS}`);
      const data: ApiResponse = await response.json();
      setItems(data.data);
      setTotalItems(data.pagination.total);
    } catch (error) {
      console.error('Failed to fetch artworks:', error);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    loadData(currentPage);
  }, [currentPage]);

const getCheckedRows = () => {
  const checked: Artwork[] = [];

  items.forEach((item, index) => {
    const globalIndex = (currentPage - 1) * PAGE_SIZE + index;

    const isBulkSelected = bulkLimit > 0 && globalIndex < bulkLimit && !removedFromBulk.has(item.id);
    const isManualSelected = selectedIds.has(item.id);

    if (isBulkSelected || isManualSelected) {
      checked.push(item);
    }
  });

  return checked;
};
  // Total selected count across all pages
  const getSelectedCount = () => {
    return bulkLimit > 0 ? bulkLimit - removedFromBulk.size + selectedIds.size : selectedIds.size;
  };

  const handleSelectionChange = (rows: Artwork[]) => {
    const newSelected = new Set(selectedIds);
    const newRemoved = new Set(removedFromBulk);
    const newIds = rows.map(r => r.id);

    items.forEach((item, index) => {
      const globalIndex = (currentPage - 1) * PAGE_SIZE + index;
      const isBulkRow = bulkLimit > 0 && globalIndex < bulkLimit;

      if (newIds.includes(item.id)) {
        if (!isBulkRow) newSelected.add(item.id);
        newRemoved.delete(item.id);
      } else {
        newSelected.delete(item.id);
        if (isBulkRow) newRemoved.add(item.id);
      }
    });

    setSelectedIds(newSelected);
    setRemovedFromBulk(newRemoved);
  };

  // Apply bulk selection
  const applyBulkSelect = () => {
    const n = parseInt(bulkNumber);
    if (!n || n <= 0) {
      alert("Enter a valid number");
      return;
    }

    setBulkLimit(Math.min(n, totalItems));
    setSelectedIds(new Set());
    setRemovedFromBulk(new Set());
    setBulkNumber('');
    panelRef.current?.hide();
  };

  const increaseBulkNumber = (e: React.MouseEvent) => {
    e.preventDefault();
    const current = Number(bulkNumber) || 0;
    if (current < totalItems) setBulkNumber(String(current + 1));
  };

  const decreaseBulkNumber = (e: React.MouseEvent) => {
    e.preventDefault();
    const current = Number(bulkNumber) || 1;
    if (current > 1) setBulkNumber(String(current - 1));
  };

  // Clear all selections
  const clearAll = () => {
    setSelectedIds(new Set());
    setRemovedFromBulk(new Set());
    setBulkLimit(0);
  };

  // Pagination
  const handlePageChange = (e: DataTablePageEvent) => {
    setCurrentPage((e.page ?? 0) + 1);
  };

  const renderTitle = (row: Artwork) => <span className="title-cell">{row.title || '—'}</span>;
  const renderArtist = (row: Artwork) => <span className="artist-cell">{row.artist_display || '—'}</span>;
  const renderOrigin = (row: Artwork) => row.place_of_origin ? <Tag value={row.place_of_origin} className="origin-pill" /> : <span className="empty-val">—</span>;
  const renderDate = (row: Artwork) => (!row.date_start && !row.date_end) ? <span className="empty-val">—</span> : <span className="date-cell">{row.date_start ?? '?'} – {row.date_end ?? '?'}</span>;
  const renderInscriptions = (row: Artwork) => (
    <span className="insc-cell" title={row.inscriptions ?? ''}>
      {row.inscriptions ? (row.inscriptions.length > 60 ? row.inscriptions.slice(0, 60) + '…' : row.inscriptions) : <span className="empty-val">N/A</span>}
    </span>
  );

  const renderCheckboxHeader = () => (
    <div className="chk-head">
      <i
        className="pi pi-chevron-down arrow-icon"
        style={{ cursor: 'pointer' }}
        onClick={e => panelRef.current?.toggle(e)}
      />
    </div>
  );

  const checkedRows = getCheckedRows();
  const selectedCount = getSelectedCount();

  return (
    <div id="main-wrap">
      <header id="top-bar">
        <div id="top-inner">
          <div id="top-left">
            <h1 id="site-title">Art Institute of Chicago</h1>
          </div>
          <div id="top-right">
            {selectedCount > 0 && (
              <div id="sel-info">
                <span id="sel-num">{selectedCount}</span>
                <span id="sel-txt">selected</span>
                <button id="clear-btn" onClick={clearAll}>
                  <i className="pi pi-times" />
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      <main id="table-wrap">
        <DataTable
          value={items}
          lazy
          paginator
          rows={PAGE_SIZE}
          totalRecords={totalItems}
          first={(currentPage - 1) * PAGE_SIZE}
          onPage={handlePageChange}
          loading={isLoading}
          selection={checkedRows}
          onSelectionChange={e => handleSelectionChange(e.value as Artwork[])}
          selectionMode="multiple"
          dataKey="id"
          rowHover
          emptyMessage="No artworks found."
          paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport"
          currentPageReportTemplate="Showing {first} to {last} of {totalRecords} artworks"
        >
          <Column header={renderCheckboxHeader} headerStyle={{ width: '4rem' }} selectionMode="multiple" />
          <Column field="title" header="Title" body={renderTitle} style={{ minWidth: '200px', maxWidth: '280px' }} />
          <Column field="place_of_origin" header="Origin" body={renderOrigin} style={{ minWidth: '120px' }} />
          <Column field="artist_display" header="Artist" body={renderArtist} style={{ minWidth: '180px', maxWidth: '240px' }} />
          <Column field="inscriptions" header="Inscriptions" body={renderInscriptions} style={{ minWidth: '200px', maxWidth: '280px' }} />
          <Column header="Date" body={renderDate} style={{ minWidth: '120px' }} />
        </DataTable>
      </main>

      <OverlayPanel ref={panelRef} className="sel-popup">
        <div className="popup-body">
          <div className="popup-top">
            <i className="pi pi-check-square popup-ico" />
            <h3 className="popup-title">Select Multiple Rows</h3>
          </div>
          <p className="popup-desc">Enter number of rows to select across all pages</p>
          <div className="popup-row">
            <div className="number-input-container">
              <InputText
                value={bulkNumber}
                onChange={e => setBulkNumber(e.target.value)}
                placeholder="e.g,20"
                type="number"
                min={1}
                max={totalItems}
                className="num-input"
                onKeyDown={e => e.key === 'Enter' && applyBulkSelect()}
              />
              <div className="spinner-buttons">
                <button type="button" className="spinner-btn spinner-up" onClick={increaseBulkNumber} disabled={bulkNumber !== '' && parseInt(bulkNumber) >= totalItems}>
                  <i className="pi pi-chevron-up" />
                </button>
                <button type="button" className="spinner-btn spinner-down" onClick={decreaseBulkNumber} disabled={bulkNumber !== '' && parseInt(bulkNumber) <= 1}>
                  <i className="pi pi-chevron-down" />
                </button>
              </div>
            </div>
            <Button label="Select" size="small" onClick={applyBulkSelect} className="apply-btn" />
          </div>
        </div>
      </OverlayPanel>
    </div>
  );
}
