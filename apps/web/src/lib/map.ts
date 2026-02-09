/**
 * 高德地图服务 - 逆地理编码和距离计算
 */

const AMAP_WEB_KEY = process.env.AMAP_WEB_KEY;

export interface GeoLocation {
    lat: number;
    lng: number;
}

export interface AddressInfo {
    formattedAddress: string;
    province: string;
    city: string;
    district: string;
    street: string;
    streetNumber: string;
}

export interface DistanceResult {
    distance: number; // 米
    duration: number; // 秒
}

/**
 * 逆地理编码 - 坐标转地址
 */
export async function reverseGeocode(location: GeoLocation): Promise<AddressInfo | null> {
    if (!AMAP_WEB_KEY) {
        console.warn('高德地图 API Key 未配置');
        return null;
    }

    try {
        const url = `https://restapi.amap.com/v3/geocode/regeo?key=${AMAP_WEB_KEY}&location=${location.lng},${location.lat}&extensions=base`;
        const response = await fetch(url);
        const data = await response.json();

        if (data.status === '1' && data.regeocode) {
            const { regeocode } = data;
            return {
                formattedAddress: regeocode.formatted_address || '',
                province: regeocode.addressComponent?.province || '',
                city: regeocode.addressComponent?.city || regeocode.addressComponent?.province || '',
                district: regeocode.addressComponent?.district || '',
                street: regeocode.addressComponent?.streetNumber?.street || '',
                streetNumber: regeocode.addressComponent?.streetNumber?.number || '',
            };
        }
        return null;
    } catch (error) {
        console.error('逆地理编码失败:', error);
        return null;
    }
}

/**
 * 地理编码 - 地址转坐标
 */
export async function geocode(address: string, city?: string): Promise<GeoLocation | null> {
    if (!AMAP_WEB_KEY) {
        console.warn('高德地图 API Key 未配置');
        return null;
    }

    try {
        const cityParam = city ? `&city=${encodeURIComponent(city)}` : '';
        const url = `https://restapi.amap.com/v3/geocode/geo?key=${AMAP_WEB_KEY}&address=${encodeURIComponent(address)}${cityParam}`;
        const response = await fetch(url);
        const data = await response.json();

        if (data.status === '1' && data.geocodes?.length > 0) {
            const [lng, lat] = data.geocodes[0].location.split(',').map(Number);
            return { lat, lng };
        }
        return null;
    } catch (error) {
        console.error('地理编码失败:', error);
        return null;
    }
}

/**
 * 计算两点间距离（Haversine 公式，本地计算）
 */
export function calculateDistance(from: GeoLocation, to: GeoLocation): number {
    const R = 6371000; // 地球半径（米）
    const dLat = toRad(to.lat - from.lat);
    const dLng = toRad(to.lng - from.lng);
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(toRad(from.lat)) * Math.cos(toRad(to.lat)) *
        Math.sin(dLng / 2) * Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; // 返回米
}

function toRad(deg: number): number {
    return deg * (Math.PI / 180);
}

/**
 * 步行/驾车距离（调用高德 API）
 */
export async function getRouteDistance(
    from: GeoLocation,
    to: GeoLocation,
    mode: 'walking' | 'driving' = 'driving'
): Promise<DistanceResult | null> {
    if (!AMAP_WEB_KEY) {
        // 降级为直线距离
        const distance = calculateDistance(from, to);
        return {
            distance,
            duration: Math.round(distance / (mode === 'walking' ? 1.4 : 8.3)), // 估算
        };
    }

    try {
        const endpoint = mode === 'walking' ? 'walking' : 'driving';
        const url = `https://restapi.amap.com/v3/direction/${endpoint}?key=${AMAP_WEB_KEY}&origin=${from.lng},${from.lat}&destination=${to.lng},${to.lat}`;
        const response = await fetch(url);
        const data = await response.json();

        if (data.status === '1' && data.route?.paths?.length > 0) {
            const path = data.route.paths[0];
            return {
                distance: parseInt(path.distance, 10),
                duration: parseInt(path.duration, 10),
            };
        }
        return null;
    } catch (error) {
        console.error('路线距离计算失败:', error);
        return null;
    }
}

/**
 * 批量计算工人到订单的距离
 */
export async function calculateWorkerDistances(
    orderLocation: GeoLocation,
    workerLocations: Array<{ workerId: string; location: GeoLocation }>
): Promise<Array<{ workerId: string; distance: number }>> {
    const results = workerLocations.map(worker => ({
        workerId: worker.workerId,
        distance: calculateDistance(orderLocation, worker.location),
    }));

    // 按距离排序
    return results.sort((a, b) => a.distance - b.distance);
}
